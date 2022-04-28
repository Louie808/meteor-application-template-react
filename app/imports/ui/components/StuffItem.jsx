import React from 'react';
import { Button, Grid, Header, Modal, Segment, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import EditStuffModal from '../pages/EditStuffModal';
import { Stuffs } from '../../api/stuff/Stuff';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class StuffItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.stuff.name}</Table.Cell>
        <Table.Cell>{this.props.stuff.quantity}</Table.Cell>
        <Table.Cell>{this.props.stuff.condition}</Table.Cell>
        <Table.Cell>
          <Link to={`/edit/${this.props.stuff._id}`}>Edit</Link>
        </Table.Cell>
        <this.EditModal/>
      </Table.Row>
    );
  }

  EditModal() {
    const [open, setOpen] = React.useState(false);
    const submitLocal = (data) => {
      console.log(data);
      const { name, quantity, condition, _id } = data;
      Stuffs.collection.update(_id, { $set: { name, quantity, condition } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Item updated successfully', 'success')));
    };
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
}

// Require a document to be passed to this component.
StuffItem.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(StuffItem);
