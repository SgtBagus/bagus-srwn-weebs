import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from './components/header/header.component';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';

import { auth, createUserProfileDocuments } from './firebase/firebase.utils';

import { setCurrentUser } from './redux/user/user.action';

import './App.css';

class App extends Component {
  unsusbcribeFromAuth = null;

  componentDidMount = () => {
    const { setCurrentUser } = this.props;

    this.unsusbcribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocuments(userAuth);

        userRef.onSnapshot(snapShot => {
          const { id } = snapShot;
          
          setCurrentUser({
            id,
            ...snapShot.data(),
          })
        });
      } else {
        setCurrentUser(userAuth)
      };
    })
  }
  
  componentWillUnmount = () => {
    this.unsusbcribeFromAuth();
  }

  render () {
    return (
      <div>
        <Header />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/signin' element={<SignInAndSignUpPage />} />
        </Routes>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(App);
