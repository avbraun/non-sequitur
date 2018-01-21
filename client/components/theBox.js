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
      allWords: []
    }
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

  render(){
    return (
        <div>
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
