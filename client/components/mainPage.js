import React, { Component } from 'react';
import firebase from '../../src/firebase.js';

export class MainPage extends Component {
  constructor(){
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render(){
    return (
      <div>
        <header>
            <div>
              <h1>Fun Food Friends</h1>
            </div>
        </header>
        <div>
          <section>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username} />
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Item</button>
              </form>
          </section>
          <section>
            <div>
              <ul>
              {
                this.state.items.map(item => {
                  return (
                    <li key={item.id}>
                      <p>{item.user} is bringing {item.title}</p>
                      <button onClick={() => this.removeItem(item.id)}>Remove</button>
                      <button onClick={() => this.editItem(item.id)}>Change To PopTart</button>
                    </li>
                  )
                })
              }
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }

  componentDidMount(){
    const itemsRef = firebase.database().ref('items');
    // when a value is added to the 'items' ref...
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      // instantiate a new array
      let newState = [];
      // loop through all items in ref, old and new, and add them to the array
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        })
      }
      // finally, this array of objects is added to our local state
      this.setState({
        items: newState
      })
    })
  }

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value })
    console.log('this.state: ', this.state)
  }

  handleSubmit(event){
    event.preventDefault();
    // calling ref method allows us to indicate where this info should be stored
    const itemsRef = firebase.database().ref('items');
    // this is the info on state that we would like to send to firebase
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    // similar to an array.push method, sends a copy of our object to be stored in firebase
    itemsRef.push(item);
    // this clears out inputs
    this.setState({
      currentItem: '',
      username: ''
    })
  }

  removeItem(itemId){
    // look up specific item by its key
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    // call firebase.database()'s remove method
    itemRef.remove();
  }

  editItem(itemId){
    const itemRef = firebase.database().ref(`/items/${itemId}`)
    const updates = {title: 'PopTart'}
    itemRef.update(updates)
    console.log('this.state (POPTART):', this.state)
  }
}

export default MainPage;
