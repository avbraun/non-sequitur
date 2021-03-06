import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Target from './dndTarget'
import BoxItem from './boxItem'

export default class Container extends Component {
  render(){
    console.log('this is working!')
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
        <h1>THIS IS WORKING.</h1>
          <div>
            <Target />
          </div>
          <div>
            <BoxItem name="Banana" />
            <BoxItem name="Paper" />
          </div>
        </div>
      </DragDropContextProvider>
    )
  }
}
