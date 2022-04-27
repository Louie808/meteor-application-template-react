import React from 'react';
import { Grid, Header, Segment, Modal, Button } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Stuffs } from '../../api/stuff/Stuff';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);

/** Renders the Page for editing a single document. */
class EditStuffModal extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    const { name, quantity, condition, _id } = data;
    Stuffs.collection.update(_id, { $set: { name, quantity, condition } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return this.renderPage();
  }

  EditModal() {
    const [open, setOpen] = React.useState(false);
    const submitLocal = (data) => { console.log(data); };
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Show Edit Modal</Button>}
      >
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content form>
          <Grid container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Edit Stuff</Header>
              <AutoForm schema={bridge} onSubmit={data => submitLocal(data)} model={this.props.stuff}>
                <Segment>
                  <TextField name='name'/>
                  <NumField name='quantity' decimal={false}/>
                  <SelectField name='condition'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                  <HiddenField name='owner' />
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
              Nope
          </Button>
          <Button
            content="Yep, that's me"
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
  renderPage() {
    return (
      <this.EditModal/>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditStuffModal.propTypes = {
  stuff: PropTypes.object,
};

export default withRouter(EditStuffModal);
