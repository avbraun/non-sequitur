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
    canDrop: monitor.canDrop()
  }
}

class Target extends Component {

  render(){
    const { canDrop, isOver, connectDropTarget, isStored } = this.props;
    const isActive = canDrop && isOver;

    // let backgroundColor = '#222';
    // if (isActive) {
    //   backgroundColor = 'darkgreen';
    // } else if (canDrop) {
    //   backgroundColor = 'darkhaki';
    // }

    return (
      connectDropTarget(
        <div className="drop-target">
          { isActive && isStored ? 'Release to add to FRIDGE' : isActive && !isStored? 'Release to send back to BOX' : 'Drag here' }
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

