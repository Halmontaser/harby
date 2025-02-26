<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="field">
            <label class="label">Username</label>
            <div class="control">
                <input  type="text" @change="canContinue" placeholder="Text input"
                       v-model="form.username">
            </div>
            <p >This username is invalid</p>
        </div>
        <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input   type="text" placeholder="Email input" v-model="form.demoEmail">
            </div>
        </div>
        <div class="field">
            <label class="label">Message</label>
            <div class="control">
                <textarea   placeholder="Textarea" v-model="form.message"></textarea>
            </div>
        </div>
    </div>
</template>

<script>


    export default {
        props: ['clickedNext', 'currentStep'],
        data() {
            return {
                form: {
                    username: '',
                    demoEmail: '',
                    message: ''
                }
            }
        },
        computed:{
          canContinue() {
             this.form.username ? this.$emit('can-continue', {value: true}):false;
          }}
        ,            

          
        mounted() {
            if(this.form.username){
                this.$emit('can-continue', {value: true});
            } else {
                this.$emit('can-continue', {value: false});
            }
        }
    }
</script>