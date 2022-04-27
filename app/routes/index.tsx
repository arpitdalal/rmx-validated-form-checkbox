import { ValidatedForm } from 'remix-validated-form';
import * as yup from 'yup';

import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { withYup } from '@remix-validated-form/with-yup';

const validator = withYup(
  yup.object({
    checkboxes: yup.array(yup.string()),
  }),
);

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const fieldValues = await validator.validate(formData);

  console.log('====================================');
  console.log("checkboxes from request.formData", formData.getAll("checkboxes"));
  console.log("checkboxes from fieldValues", fieldValues.submittedData.checkboxes);
  console.log('====================================');
  
  return json({
    error: fieldValues.error?.fieldErrors.checkboxes,
    formDataCheckboxesType: Array.isArray(formData.getAll("checkboxes")) ? "array" : typeof formData.getAll("checkboxes"),
    fieldValueCheckboxesType: Array.isArray(fieldValues.submittedData.checkboxes) ? "array" : typeof fieldValues.submittedData.checkboxes,
  })
}

export default function Index() {
  const actionData = useActionData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Remix with Validated Forms 🎉</h1>
      <div>
        <h2>Details</h2>
        <ol>
          <li>Submit the form with only 1 checkbox selected and <Code>fieldValues</Code> will return a <Code>string</Code> but <Code>formData.getAll</Code> returns an <Code>array</Code>. Which makes the <Code>validator</Code> unhappy as it expects it to be an <Code>array</Code> but it is actually a <Code>string</Code></li>
          <li>Submit the form with 2 or more checkboxes selected, then the <Code>fieldValues</Code> will give the correct type of <Code>array</Code></li>
        </ol>
      </div>
      <ValidatedForm id="form" validator={validator} method="post" reloadDocument>
        <label>
          one:
          <input type="checkbox" name="checkboxes" value="one" />
        </label>
        <label>
          two:
          <input type="checkbox" name="checkboxes" value="two" />
        </label>
        <label>
          three:
          <input type="checkbox" name="checkboxes" value="three" />
        </label>
        <p>
          <button type="submit">Submit</button>
        </p>
      </ValidatedForm>
      {
        actionData ? (
          <>
            <p style={{color: "red"}}>Validated fields error: {actionData.error}</p>
            <p>Type of form data checkboxes: {actionData.formDataCheckboxesType}</p>
            <p>Type of field value checkboxes: {actionData.fieldValueCheckboxesType}</p>
          </>
        ) : null
      }
    </div>
  );
}

function Code ({children}: {children: React.ReactNode}) {
  return (
    <code style={{color: "red"}}>
      {children}
    </code>
  )
}
