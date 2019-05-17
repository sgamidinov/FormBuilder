import "./styles.css";
import FormBuilder, { FormField, Validators } from "./formBuilder";

const field = new FormField({
  name: 'age',
  configuration: {
    errorClass: 'invalid',
    validators: [
      {
        rule: Validators.Required(),
        message: 'This field is required and must be filled out!!!'
      },
      {
        rule: Validators.maxLength(12),
        message: 'Max possible length is 12'
      }
    ],
    onError: function() {
      console.log('errored')
    }
  }
})

const agreement = new FormField({
  name: 'agreement',
  configuration: {
    validators: [
      {
        rule: Validators.mustBeChecked(),
        message: 'Check this box out'
      }
    ]
  }
})

