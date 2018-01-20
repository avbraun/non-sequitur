import React, { Component, PropTypes } from 'react';
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
    const { canDrop, isOver, connectDropTarget } = this.props;
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
          { isActive ? 'Release to drop' : 'Drag a box here' }
        </div>
      )
    )
  }
}

// Target.propTypes = {
//   connectDropTarget: PropTypes.func.isRequired,
//   isOver: PropTypes.bool.isRequired,
//   canDrop: PropTypes.string.isRequired
// };

export default DropTarget(ItemTypes.BOX, boxTarget, collect)(Target);

