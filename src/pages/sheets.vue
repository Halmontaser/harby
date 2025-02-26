<script setup lang="ts">
import { ref } from 'vue'
import { Button,FormControl,Tabs } from 'frappe-ui'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/component            s/ui/sheet'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

const username = ref('')
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <Sheet v-for="side in SHEET_SIDES" :key="side">
      <SheetTrigger as-child>
        <Button variant="outline">
          {{ side }}
        </Button>
      </SheetTrigger>
      <SheetContent :side="side">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div class="grid gap-4 py-4">
          <div class="grid items-center grid-cols-4 gap-4">
            <div class="p-2">
  <FormControl
    type="checkbox"
    size="sm"
    variant="subtle"
    placeholder="is the docs checked by orgnial"
    :disabled="false"
    label="match the hard copy"
    modelValue="validated"
  />
</div>
  <FormControl
    type="checkbox"
    size="sm"
    variant="subtle"
    placeholder="is the docs checked by orgnial"
    :disabled="false"
    label="review the data and update"
    modelValue="review"
  />
</div>
<div class="p-2">
  <FormControl
    :type="'text'"
    :ref_for="true"
    size="lg"
    variant="subtle"
    placeholder="make your comments here"
    :disabled="false"
    label="comment on doc"
    v-model="state.modelValue"
  />
</div>
<Button
  :variant="'solid'"
  theme="gray"
  size="sm"
  label="Button"
  :loading="false"
>
  make comment
</Button>
          </div>
          
        </div>
        <SheetFooter>
          <SheetClose as-child>
            
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>