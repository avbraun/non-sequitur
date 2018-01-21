import React, {Component} from 'react'
import firebase from '../../src/firebase.js'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Target from './dndTarget'
import BoxItem from './boxItem'
import ItemTypes from './itemTypes';

export default class TheBox extends Component{
  constructor(props){
    super(props);
    this.state = {
      newWord: '',
      allWords: []
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
  }

  handleInputChange(event){
    this.setState({ newWord: event.target.value })
  }

  handleSubmit(event){
    event.preventDefault();
    const wordsRef = firebase.database().ref('words');
    const word = {
      word: this.state.newWord,
      x: 276,
      y: 9,
      isStored: true
    }
    wordsRef.push(word)
      .then(() => this.setState({...this.state, newWord: ''}))
  }

  render(){

    return (
        <div>
          <form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>
            <input type="text" name="newWord" placeholder="Enter a word!" value={this.state.newWord} />
            <button>Create Word</button>
          </form>
          <DragDropContextProvider backend={HTML5Backend}>
          <div className="footer">
            <div className="target">
              <Target />
            </div>
            <div className="box-fridge-wrapper">
            <p className="box-header">In the Box</p>
              <div className="in-the-box">
                {
                  this.state.allWords.filter(word => word.isStored).map(filteredWord =>
                    <BoxItem
                      key={filteredWord.id}
                      name={filteredWord.word}
                      type={ItemTypes.WORD}
                      id={filteredWord.id}
                      isStored={filteredWord.isStored}
                    />
                  )
                }
              </div>
              <p className="fridge-header">On the Fridge</p>
              <div className="on-the-fridge">
                {
                  this.state.allWords.filter(word => !word.isStored).map(filteredWord =>
                    <BoxItem
                      key={filteredWord.id}
                      name={filteredWord.word}
                      id={filteredWord.id}
                      isStored={filteredWord.isStored}
                    />
                  )
                }
            </div>
          </div>
          </div>
      </DragDropContextProvider>
      </div>
    )
  }
}
