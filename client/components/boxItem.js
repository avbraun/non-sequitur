import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';
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
    let wordRef = firebase.database().ref(`/words/${item.id}`)

    if (dropResult && item.isStored) {
      let updates = { isStored: false }
      wordRef.update(updates)
    } else if (dropResult && !item.isStored){
      let updates = { isStored: true }
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

class BoxItem extends Component {

  render(){
    const { isDragging, connectDragSource, name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div className="box-page-draggable-child" style={{opacity}}>
        {name}
        </div>
      )
    )
  }
}

BoxItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
};

export default DragSource(ItemTypes.WORD, boxSource, collect)(BoxItem)
