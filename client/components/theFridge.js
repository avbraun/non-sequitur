import React, {Component} from 'react'
import Draggable from 'react-draggable'
import firebase from '../../src/firebase.js'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Target from './dndTarget'

export default class TheFridge extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectedWordId: '',
      allWords: []
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
  }

  componentDidMount(){
    const wordsRef = firebase.database().ref('words');
    // when the 'words' ref has value...
    wordsRef.on('value', (snapshot) => {
      let words = snapshot.val();
      let newState = [];
      for (let singleWord in words) {
        newState.push({
          id: singleWord,
          word: words[singleWord].word,
          isStored: words[singleWord].isStored,
          x: words[singleWord].x,
          y: words[singleWord].y
        })
      }
      this.setState({
        allWords: newState
      })
    })

    // when a child of words ref changes...
    wordsRef.on('child_changed', snapshot => {
      let words = snapshot.val();
      let newState = [];
      for (let singleWord in words){
        newState.push({
          id: singleWord,
          word: words[singleWord].word,
          isStored: words[singleWord].isStored,
          x: words[singleWord].x,
          y: words[singleWord].y
        })
      }
      this.setState({
        allWords: newState
      })
    })

  //   wordsRef.on('child_added', (snapshot) => {
  //     let words = snapshot.val();
  //     let newState = [];
  //     for (let singleWord in words) {
  //       newState.push({
  //         id: singleWord,
  //         word: words[singleWord].word,
  //         x: words[singleWord].x,
  //         y: words[singleWord].y
  //       })
  //     }
  //     this.setState({
  //       allWords: newState
  //     })
  //   })
  }

  handleStart(item){
    this.setState({
      ...this.state,
      selectedWordId: item.id
    })
  }

  handleStop(e, ui){
    let wordId = this.state.selectedWordId
    let wordRef = firebase.database().ref(`/words/${wordId}`)
    let updates = {
      x: ui.lastX,
      y: ui.lastY
    }
    wordRef.update(updates)

    this.setState({
      ...this.state,
      selectedWordId: ''
    })
  }

  render(){

    return (
      <div>
      <div className="the-fridge">
          {
            this.state.allWords.filter(unfilteredWord => {
              return (
                !unfilteredWord.isStored
              )}).map(filteredWord =>
              (<Draggable
                key={filteredWord.id}
                handle=".handle"
                defaultPosition={ { x: filteredWord.x, y: filteredWord.y } }
                position={null}
                onStart={() => this.handleStart(filteredWord)}
                onStop={this.handleStop}>
                <div className="handle">
                  <h3 className="draggable-child">{filteredWord.word}</h3>
                </div>
              </Draggable>)
            )
          }
      </div>
      </div>
    )
  }
}
