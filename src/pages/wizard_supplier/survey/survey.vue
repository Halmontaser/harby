<template>
    <SurveyComponent :model="survey" />
</template>
<script setup lang="ts">
    import { Model } from "survey-core";
    import { SurveyComponent } from "survey-vue3-ui";
    import { json } from "./json.ts";
    import "./modern.css";
    import { themeJson } from "./theme";
    const emit = defineEmits(["nextStep", "canContinue"]);

    const survey = new Model(json);
    survey.applyTheme(themeJson);
    survey.onComplete.add((sender, options) => {
        emit('canContinue', true);
        emit('nextStep', sender.data);
        console.log(JSON.stringify(sender.data, null, 3));
    });
</script>