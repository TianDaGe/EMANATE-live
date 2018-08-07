// @flow
import React, { Component } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import SoundEngine from 'sound-engine';

import './TrackBrowser.css';
import Auth from '../../../common/Auth';
import Playlist from '../../../common/Playlist/';
import TrackPlayer from '../TrackPlayer';

import { BlockConsoleControl } from '../../common/BlockConsole/BlockConsole';


type Props = {
  auth: Auth,
  soundengine: SoundEngine,
  playlist: Playlist,
  query: string,
  blockconsole: BlockConsoleControl,

  location: any,
  history: any,
  match: any,
  intl: intlShape
};

type State = {
  waitingForSounds: boolean,
  atTheEnd: boolean,
  query: string,
  sounds: [],
  current: any,
  blockconsoleHidden: boolean
};

class TrackBrowser extends Component<Props, State> {
  state: State;
  auth: Auth;
  soundengine: SoundEngine;
  playlist: Playlist;
  trackBrowserEl: {};
  blockconsole: BlockConsoleControl;

  constructor(props) {
    super(props);

    // Get the auth service
    this.auth = this.props.auth;

    // Get the engines
    this.soundengine = this.props.soundengine;
    this.playlist = this.props.playlist;

    this.trackBrowserEl = React.createRef();

    this.blockconsole = props.blockconsole;
    this.blockconsole.update("TrackBrowser.");

    this.blockconsole.on('showHide', (hidden) => {
      this.setState({ blockconsoleHidden: hidden });
    });

    // Hook to get ref to element
    this.setTrackBrowserEl = element => {
      this.trackBrowserEl = element;

      // TODO: Temporary hack - Ref not working
      this.trackBrowserEl = document.getElementById('TrackBrowser');
      this.trackBrowserEl.addEventListener('scroll', this.handleScroll);
    };

    // Get our query
    const query = this.props.query;

    // Initial state
    this.state = {
      waitingForSounds: true,
      atTheEnd: false,
      query,
      sounds: [],
      current: null,
      blockconsoleHidden: this.blockconsole.hidden
    };

    console.log('console open', this.state.blockconsoleOpen);

    // Bind methods
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePlaylistSounds = this.handlePlaylistSounds.bind(this);
    this.handlePlaylistNextSounds = this.handlePlaylistNextSounds.bind(this);
  }

  // Event handlers

  handleScroll = function() {
    // At the end of feed? Or already waiting?
    if(this.state.atTheEnd || this.state.waitingForSounds) return;

    let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
        wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        height = document.body.clientHeight,
        trackBrowserScrollTop = (this.trackBrowserEl !== undefined) ? this.trackBrowserEl.scrollTop+this.trackBrowserEl.offsetHeight : (document.documentElement || document.body.parentNode || document.body).scrollTop,
        scrollHeight = (this.trackBrowserEl !== undefined) ? this.trackBrowserEl.scrollHeight : 0;

    if(trackBrowserScrollTop > scrollHeight - 100) {
      // Near the end of our list, get more sounds...
      this.playlist.getNextSoundsList();
      // Mark as waiting
      this.setState({
        waitingForSounds: true
      })
    }

    // if(scrollTop + wh > height - 100) {
    //   // Near the end of our list, get more sounds...
    //   this.playlist.getNextSoundsList();
    //   // Mark as waiting
    //   this.setState({
    //     waitingForSounds: true
    //   })
    // }
  }

  handlePlaylistSounds = function(sounds) {
    this.setState({
      sounds,
      atTheEnd: (sounds.length === 0),
      waitingForSounds: false
    });

    console.log(`handlePlaylistSounds. At the end: ${this.state.atTheEnd}. Waiting for sounds: ${this.state.waitingForSounds}`);
  }

  handlePlaylistNextSounds = function(nextsounds) {
    if(nextsounds.length === 0) {
      this.setState({
        atTheEnd: true
      });
      return;
    }

    var sounds = [];
    sounds.push(...this.state.sounds, ...nextsounds);
    this.setState({
      sounds,
      waitingForSounds: false
    });

    console.log(`handlePlaylistNextSounds. At the end: ${this.state.atTheEnd}. Waiting for sounds: ${this.state.waitingForSounds}`);
  }


  // Component lifecycle hooks

  componentDidMount() {
    this._isMounted = true;

    // Bind window events
    // window.addEventListener('scroll', this.handleScroll);

    // Bind Playlist events
    this.playlist.on('sounds', this.handlePlaylistSounds);
    this.playlist.on('next-sounds', this.handlePlaylistNextSounds);

    // Get sounds list
    this.playlist.getSoundsList(this.state.query, this.props.match.params);
  }

  componentWillUnmount() {
    this._isMounted = false;

    // Unbind window events
    // this.trackBrowserEl.removeEventListener('scroll', this.handleScroll);

    // Unbind Playlist events
    this.playlist.un('sounds', this.handlePlaylistSounds);
    this.playlist.un('next-sounds', this.handlePlaylistNextSounds);

    console.log('will unmount');
  }


  // Render

  getTrackPlayer(sound) {
    return (<TrackPlayer key={sound.id}
      auth={this.auth}
      soundengine={this.soundengine}
      playlist={this.playlist}
      sound={sound}
      blockconsole={this.blockconsole}
    />);
  }

  render() {
    var user = this.auth.getAuthUser(),
        classNames = this.state.blockconsoleHidden ? 'TrackBrowser' : 'TrackBrowser blockconsole-open';


    var category;
    if(this.props.match.params.category) {
      category = (
        <div className="row-fluid">
          <div className="category-top">
            <Badge className="category-tag">#{this.props.match.params.category}</Badge>
          </div>
        </div>
      );
    }

    var loadMore;
    if(!this.state.atTheEnd) {
      loadMore = (
        <div className="row-fluid load-more-container">
          <img src="./img/mn8-icon.svg"/>
        </div>
      );
    } else {
      loadMore = (
        <div className="feed-footer">
          <i className="fa fa-ellipsis-h fa-lg" />
          <p>
            <br />
            Emanate <i className="heart fa fa-heart-o" /> music
          </p>
        </div>
      );
    }

    if(this.state.sounds.length > 0) {
      var players = this.state.sounds.map((sound) => this.getTrackPlayer(sound));

      return (
        <section className="animated fadeIn">
          <div className="container-fluid main-container-bg">
            <Col xs={12} id="TrackBrowser" className={classNames} ref={this.setTrackBrowserEl}>
              <Row className="listen-head">
                <Col xs={12} sm={5}>
                  <h2>Latest Releases</h2>
                </Col>
                <Col xs={4} xsHidden>
                  Name
                </Col>
                <Col xs={1} xsHidden>
                  Style
                </Col>
                <Col xs={1} xsHidden>
                  BPM
                </Col>
                <Col xs={1} xsHidden>
                  Key
                </Col>
              </Row>
              {category}
              {players}
              {loadMore}
            </Col>
          </div>
        </section>
      );
    } else if(this.state.waitingForSounds) {
      return (
        <section className="preload-logo-container animated fadeIn">
          <img src="./img/mn8-icon.svg"/>
        </section>
      );
    } else {
      return (
        <section className="animated fadeIn">
          <div id="TrackBrowser" className={classNames}>
            <Col xs={12} className="empty-feed">
              <p className="spread">Oops! Looks like {this.props.match.params.user === user.name ? 'you' : '@' + this.props.match.params.user} didn{'\''}t spread <i className="heart fa fa-heart" /> for a while...</p>
              <p className="ask">{this.props.match.params.user === user.name ? 'Just click on upload above and share your sounds...' : 'Ask your friend to share his sounds with us...'}</p>
              <i className="fa fa-ellipsis-h fa-lg" />
              <p>
                <br />
                Emanate <i className="heart fa fa-heart-o" /> music
              </p>
            </Col>
          </div>
        </section>
      );
    }
  }
}

export default injectIntl(TrackBrowser);
