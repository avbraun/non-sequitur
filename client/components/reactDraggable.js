import React, {Component} from 'react'
import Draggable from 'react-draggable'
import firebase from '../../src/firebase.js'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Target from './dndTarget'
import DraggableItem from './dndDraggableItem'
import { Container } from 'semantic-ui-react'

export default class ReactDraggable extends Component{
  constructor(props){
    super(props);
    this.state = {
      newWord: '',
      selectedWordId: '',
      allWords: []
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
  }

  componentDidMount(){
    const wordsRef = firebase.database().ref('words');
    // when a value is added to the 'words' ref...
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

    wordsRef.on('child_added', (snapshot) => {
      let words = snapshot.val();
      let newState = [];
      for (let singleWord in words) {
        newState.push({
          id: singleWord,
          word: words[singleWord].word,
          x: words[singleWord].x,
          y: words[singleWord].y
        })
      }
      this.setState({
        allWords: newState
      })
    })
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

  handleInputChange(event){
    this.setState({ newWord: event.target.value })
  }

  handleSubmit(event){
    event.preventDefault();
    // calling ref method allows us to indicate where this info should be stored
    const wordsRef = firebase.database().ref('words');
    const word = {
      word: this.state.newWord,
      x: 276,
      y: 9,
      isStored: true
    }
    wordsRef.push(word);
    this.setState({...this.state,
      newWord: ''
    })
  }

  render(){

    return (
      <div>
        <Container>
          <form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>
            <input type="text" name="newWord" placeholder="Enter a word!" value={this.state.newWord} />
            <button>Add Item</button>
          </form>
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
          </Container>
          <DragDropContextProvider backend={HTML5Backend}>
          <div className="footer">
            <div className="target">
              <Target />
            </div>
            <div className="word-list">
              {
                this.state.allWords.filter(word => word.isStored).map(filteredWord => {
                  return <DraggableItem
                    name={filteredWord.word}
                    id={filteredWord.id}
                    isStored={filteredWord.isStored}
                  />
                })
              }
            </div>
          </div>
      </DragDropContextProvider>
      </div>
    )
  }
}
