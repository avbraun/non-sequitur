import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';
import firebase from '../../src/firebase.js';

const boxSource = {
  // can add things here based on what info you want to have access to via handleDrop 'item'
  beginDrag(props){
    return {
      name: props.name,
      id: props.id,
      isStored: props.isStored
    }
  },
  endDrag(props, monitor){
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      console.log(`You dropped ${item.name}, item:${item.id}, on to ${dropResult.name}`)
      let wordRef = firebase.database().ref(`/words/${item.id}`)
      let updates = {
        isStored: false
      }
      wordRef.update(updates)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableItem extends Component {

  render(){
    const { isDragging, connectDragSource, name } = this.props;
    // const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div>
        {name}
        </div>
      )
    )
  }
}

// DraggableItem.propTypes = {
//   connectDragSource: PropTypes.func.isRequired,
//   isDragging: PropTypes.bool.isRequired,
//   name: PropTypes.string.isRequired
// };

export default DragSource(ItemTypes.BOX, boxSource, collect)(DraggableItem)
