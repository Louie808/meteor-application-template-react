import React from 'react';
import { Grid, Segment, Button, Header, Modal } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/Stuff';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  quantity: Number,
  condition: {
    type: String,
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddStuff extends React.Component {

  // On submit, insert the data.
  submit(data, formRef) {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    Stuffs.collection.insert({ name, quantity, condition, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  AddModal() {
    const submitLocal = (data) => { console.log(data); };
    const [open, setOpen] = React.useState(false);
    let fRef = null;
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Add Modal</Button>}
      >
        <Modal.Header>Add A Stuff Item</Modal.Header>
        <Modal.Content AutoForm>
          <Grid container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Add Stuff</Header>
              <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submitLocal(data, fRef)} >
                <Segment>
                  <TextField name='name'/>
                  <NumField name='quantity' decimal={false}/>
                  <SelectField name='condition'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
              Cancel
          </Button>
          <Button
            content="Finished Adding Items"
            labelPosition='right'
            icon='checkmark'
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </Modal>
    );
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    return (
      <this.AddModal/>
    );
  }
}

export default AddStuff;
