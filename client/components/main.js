import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, NavLink} from 'react-router-dom'
import {logout} from '../store'
import firebase from '../../src/firebase.js'

export default class Main extends Component{
  constructor(props){
    super(props)
    this.state = {
      newWord: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
      .then(() => this.setState({newWord: ''}))
  }

  render(){
    const {children} = this.props
    return (
      <div>
        <p className="main-header">Non Sequitur.</p>
        <nav>
          <NavLink to="/fridge">The Fridge</NavLink>
          <NavLink to="/box">The Box</NavLink>
          <form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>
            <input type="text" name="newWord" placeholder="Add new word" />
        </form>
        </nav>
        <hr />
        {children}
      </div>
    )
  }
}
