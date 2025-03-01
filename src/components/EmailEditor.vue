<template>
  <TextEditor
    ref="textEditor"
    :editor-class="[
      'prose-sm max-w-none',
      editable && 'min-h-[7rem]',
      '[&_p.reply-to-content]:hidden',
    ]"
    :content="content"
    @change="editable ? (content = $event) : null"
    :starterkit-options="{
      heading: { levels: [2, 3, 4, 5, 6] },
      heading: { levels: [2, 3, 4, 5, 6] },
      paragraph: false,
    }"
    :placeholder="placeholder"
    :editable="editable"
    :extensions="[CustomParagraph]"
  >
    <template #top>
      <div class="flex flex-col gap-3">
        <div class="sm:mx-10 mx-4 flex items-center gap-2 border-t pt-2.5">
          <span class="text-xs text-gray-500">{{ TO }}:</span>
          <MultiselectInput
            class="flex-1"
            v-model="toEmails"
            :validate="validateEmail"
            :error-message="
              (value) => '{value} is an invalid email address'
            "
          />
          <div class="flex gap-1.5">
            <Button
              :label="CC"
              variant="ghost"
              @click="toggleCC()"
              :class="[
                cc ? '!bg-gray-300 hover:bg-gray-200' : '!text-gray-500',
              ]"
            />
            <Button
              :label="BCC"
              variant="ghost"
              @click="toggleBCC()"
              :class="[
                bcc ? '!bg-gray-300 hover:bg-gray-200' : '!text-gray-500',
              ]"
            />
          </div>
        </div>
        <div v-if="cc" class="sm:mx-10 mx-4 flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ CC }}:</span>
          <MultiselectInput
            ref="ccInput"
            class="flex-1"
            v-model="ccEmails"
            :validate="validateEmail"
            :error-message="
              (value) => __('{0} is an invalid email address', [value])
            "
          />
        </div>
        <div v-if="bcc" class="sm:mx-10 mx-4 flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ BCC }}:</span>
          <MultiselectInput
            ref="bccInput"
            class="flex-1"
            v-model="bccEmails"
            :validate="validateEmail"
            :error-message="
              (value) => __('{0} is an invalid email address', [value])
            "
          />
        </div>
        <div class="sm:mx-10 mx-4 flex items-center gap-2 pb-2.5">
          <span class="text-xs text-gray-500">{{ SUBJECT }}:</span>
          <TextInput
            class="flex-1 border-none bg-white hover:bg-white focus:border-none focus:!shadow-none focus-visible:!ring-0"
            v-model="subject"
          />
        </div>
      </div>
    </template>
    <template v-slot:editor="{ editor }">
      <EditorContent
        :class="[
          editable &&
            'sm:mx-10 mx-4 max-h-[35vh] overflow-y-auto border-t py-3',
        ]"
        :editor="editor"
      />
    </template>
    <template v-slot:bottom>
      <div v-if="editable" class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-2 sm:px-10 px-4">
          <AttachmentItem
            v-for="a in attachments"
            :key="a.file_url"
            :label="a.file_name"
          >
            <template #suffix>
              <FeatherIcon
                class="h-3.5"
                name="x"
                @click.stop="removeAttachment(a)"
              />
            </template>
          </AttachmentItem>
        </div>
        <div
          class="flex justify-between gap-2 overflow-hidden border-t sm:px-10 px-4 py-2.5"
        >
          <div class="flex gap-1 items-center overflow-x-auto">
            <TextEditorBubbleMenu :buttons="textEditorMenuButtons" />
         
            <FileUploader
              :upload-args="{
                doctype: doctype,
                docname: modelValue.name,
                private: true,
              }"
              @success="(f) => attachments.push(f)"
            >
              <template #default="{ openFileSelector }">
                <Button variant="ghost" @click="openFileSelector()">
                  <template #icon>
                    <AttachmentIcon class="h-4" />
                  </template>
                </Button>
              </template>
            </FileUploader>
            <Button
              variant="ghost"
              @click="showEmailTemplateSelectorModal = true"
            >
              <template #icon>
                <Email2Icon class="h-4" />
              </template>
            </Button>
          </div>
          <div class="mt-2 flex items-center justify-end space-x-2 sm:mt-0">
            <Button v-bind="discardButtonProps || {}" :label="Discard" />
            <Button
              variant="solid"
              v-bind="submitButtonProps || {}"
              :label="Send"
            />
          </div>
        </div>
      </div>
    </template>
  </TextEditor>
 
</template>

<script setup>
import Email2Icon from '@/components/Icons/Email2Icon.vue'
import AttachmentIcon from '@/components/Icons/AttachmentIcon.vue'
import AttachmentItem from '@/components/AttachmentItem.vue'
import MultiselectInput from '@/components/Controls/MultiselectInput.vue'
import { TextEditorBubbleMenu, TextEditor, FileUploader, call } from 'frappe-ui'
import { validateEmail } from '@/utils'
import Paragraph from '@tiptap/extension-paragraph'
import { EditorContent } from '@tiptap/vue-3'
import { ref, computed, defineModel, nextTick } from 'vue'
const props = defineProps({
  placeholder: {
    type: String,
    default: null,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  doctype: {
    type: String,
    default: 'CRM Lead',
  },
  subject: {
    type: String,
    default: 'Email from Lead',
  },
  editorProps: {
    type: Object,
    default: () => ({}),
  },
  submitButtonProps: {
    type: Object,
    default: () => ({}),
  },
  discardButtonProps: {
    type: Object,
    default: () => ({}),
  },
})

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {}
          }
          return {
            class: `${attributes.class}`,
          }
        },
      },
    }
  },
})

const modelValue = defineModel()
const attachments = defineModel('attachments')
const content = defineModel('content')

const textEditor = ref(null)
const cc = ref(false)
const bcc = ref(false)

const subject = ref(props.subject)
const toEmails = ref(modelValue.value.email ? [modelValue.value.email] : [])
const ccEmails = ref([])
const bccEmails = ref([])
const ccInput = ref(null)
const bccInput = ref(null)

const editor = computed(() => {
  return textEditor.value.editor
})

function removeAttachment(attachment) {
  attachments.value = attachments.value.filter((a) => a !== attachment)
}

const showEmailTemplateSelectorModal = ref(false)


function toggleCC() {
  cc.value = !cc.value
  cc.value && nextTick(() => ccInput.value.setFocus())
}

function toggleBCC() {
  bcc.value = !bcc.value
  bcc.value && nextTick(() => bccInput.value.setFocus())
}

defineExpose({
  editor,
  subject,
  cc,
  bcc,
  toEmails,
  ccEmails,
  bccEmails,
})

const textEditorMenuButtons = [
  'Paragraph',
  ['Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'],
  'Separator',
  'Bold',
  'Italic',
  'Separator',
  'Bullet List',
  'Numbered List',
  'Separator',
  'Align Left',
  'Align Center',
  'Align Right',
  'FontColor',
  'Separator',
  'Image',
  'Video',
  'Link',
  'Blockquote',
  'Code',
  'Horizontal Rule',
  [
    'InsertTable',
    'AddColumnBefore',
    'AddColumnAfter',
    'DeleteColumn',
    'AddRowBefore',
    'AddRowAfter',
    'DeleteRow',
    'MergeCells',
    'SplitCell',
    'ToggleHeaderColumn',
    'ToggleHeaderRow',
    'ToggleHeaderCell',
    'DeleteTable',
  ],
]
</script>
