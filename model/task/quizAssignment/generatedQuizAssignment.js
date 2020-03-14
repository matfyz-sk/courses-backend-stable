import { quizAssignment } from "./quizAssignment";

export const generatedQuizAssignment = {
   type: "generatedQuizAssignment",
   subclassOf: quizAssignment,
   props: {
      hasTopicAppearance: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topicAppearance"
      }
   }
};
