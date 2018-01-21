import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './itemTypes';

const boxTarget = {
  drop() {
    return { name: 'the fridge'}
  }
}

function collect (connect, monitor){
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
}

class Target extends Component {

  render(){
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    let message;

    let backgroundColor = 'black';
    let color = 'white';
    if (isActive) {
      backgroundColor = 'fuchsia';
    } else if (isActive && canDrop) {
      backgroundColor = 'white';
      color = 'fuchsia'
    }

    if (!isActive){
      message = 'Drag here to move'
    } else {
      message = 'Release to drop'
    }

    return (
      connectDropTarget(
        <div className="drop-target" style={{ backgroundColor }}>
          {message}
        </div>
      )
    )
  }
}

Target.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.WORD, boxTarget, collect)(Target);

