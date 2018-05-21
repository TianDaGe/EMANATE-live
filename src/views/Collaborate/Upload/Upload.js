import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Alert, Button, FormGroup, FormControl, Label, ProgressBar, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import './upload.css';

// import xss from '../../common/util/xss';


export default class Upload extends Component {

  constructor(props) {
    super(props);

    // Get services
    this.auth = this.props.auth;
    this.steem = this.props.steem;
    this.ipfs = this.props.ipfs;
    this.soundengine = this.props.soundengine;

    // Initial state
    this.state = {
      upload: {
        title: '',
        desc: '',
        type: '',
        genre: '',
        tags: '',
        download: true,
        dlgate: '',
        buy: false,
        buyurl: ''
      },
      validation: {
        title: false,
        type: false,
        genre: false
      },
      ipfs: {
        sound: '',
        cover: '',
        peaks: ''
      },
      stateSound: 'init',
      stateCover: 'init',
      isDoneSound: false,
      isDoneCover: false,
      isPublished: false
    };

    // Bind event handlers
    this.onDragOverSound = this.onDragOverSound.bind(this);
    this.onDragOverCover = this.onDragOverCover.bind(this);
    this.onDragLeaveSound = this.onDragLeaveSound.bind(this);
    this.onDragLeaveCover = this.onDragLeaveCover.bind(this);
    this.onSelectSoundFile = this.onSelectSoundFile.bind(this);
    this.onSelectCoverFile = this.onSelectCoverFile.bind(this);
    this.handleSoundFiles = this.handleSoundFiles.bind(this);
    this.handleCoverFiles = this.handleCoverFiles.bind(this);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onFormatTitle = this.onFormatTitle.bind(this);
    this.onChangeDesc = this.onChangeDesc.bind(this);
    this.onFormatDesc = this.onFormatDesc.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeGenre = this.onChangeGenre.bind(this);
    this.onFormatGenre = this.onFormatGenre.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onFormatTags = this.onFormatTags.bind(this);
    this.onChangeDl = this.onChangeDl.bind(this);
    this.onChangeDlGate = this.onChangeDlGate.bind(this);
    this.onFormatDlGate = this.onFormatDlGate.bind(this);
    this.onChangeBuy = this.onChangeBuy.bind(this);
    this.onChangeBuyUrl = this.onChangeBuyUrl.bind(this);
    this.onFormatBuyUrl = this.onFormatBuyUrl.bind(this);

    this.doPublish = this.doPublish.bind(this);
    this.doCancel = this.doCancel.bind(this);
  }

  // Event handlers

  onDragOverSound(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    this.setState({ stateSound: 'over' });
  }

  onDragLeaveSound(e) {
    this.setState({ stateSound: (this.state.isDoneSound ? 'done' : 'init') });
  }

  onSelectSoundFile() {
    const input = ReactDOM.findDOMNode(this.refs.uploadSoundFile);
    input.click();
  }

  handleSoundFiles(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files || e.dataTransfer.files;

    // If we don't have files it's ok
    if(!files || files.length === 0) return;

    // Get the first file (if more than one through d&d)
    var file = null;
    for(let i = 0; i < files.length; i++) {
      if(files[i].type.startsWith('audio/')) {
        file = files[i];
        break;
      }
    }
    if(!file) {
      toast.error('Unsuported sound file. Please use .wav, .mp3, or other standard format...');
      return;
    }

    // Auto fill-in the title from the track file name, if empty...
    var title = this.state.upload.title;
    var titleval = this.state.validation.title;
    if(title === '') {
      if(file.name) {
        title = file.name.split('.')[0];
        titleval = (title.length > 6);
      }
    }

    // Set processing state
    this.setState({
      upload: {
        ...this.state.upload,
        title
      },
      validation: {
        ...this.state.validation,
        title: titleval
      },
      stateSound: 'processing'
    });

    var snddata;
    this.readFileData(file)
      .then(data => {
        snddata = data;
        return this.getSoundPeaks(data);
      })
      .then((result) => {
        // Deconstruct result
        var {peaks, duration} = result;
        // Set uploading state
        this.setState({
          upload: {
            ...this.state.upload,
            duration
          },
          stateSound: 'uploading'
        });
        // Correct peaks for desired accuracy
        const accuracy = 10000; // 4 decimal places
        const arr = [].map.call(peaks, val => Math.round(val * accuracy) / accuracy);
        return this.ipfs.fileAdd(JSON.stringify(arr));
      })
      .then(res => {
        // Save the peaks file hash
        this.setState({
          ipfs: {
            ...this.state.ipfs,
            peaks: res[0].hash
          },
        });
        return this.ipfs.fileAdd(snddata);
      })
      .then(res => {
        // Save the sound file hash
        this.setState({
          ipfs: {
            ...this.state.ipfs,
            sound: res[0].hash
          },
          stateSound: 'done',
          isDoneSound: true
        });
      })
      .catch(err => {
        if(this.state.stateSound === 'processing') {
          toast.error('Couln\'t process the file. Try with another format please...');
        } else {
          toast.error('Couldn\'t upload the file. Please check your IPFS settings...');
        }
        console.log(err);
        // Rollback state
        this.setState({
          stateSound: 'init'
        });
      });
  }

  onDragOverCover(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    this.setState({ stateCover: 'over' });
  }

  onDragLeaveCover(e) {
    this.setState({ stateCover: (this.state.isDoneCover ? 'done' : 'init') });
  }

  onSelectCoverFile() {
    const input = ReactDOM.findDOMNode(this.refs.uploadCoverFile);
    input.click();
  }

  handleCoverFiles(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files || e.dataTransfer.files;

    // If we don't have files it's ok
    if(!files || files.length === 0) return;

    // Get the first file (if more than one through d&d)
    var file = null;
    for(let i = 0; i < files.length; i++) {
      if(files[i].type.startsWith('image/')) {
        file = files[i];
        break;
      }
    }
    if(!file) {
      toast.error('Unsuported cover file. Please use .jpg, .png, or other standard format...');
      return;
    }

    // Set uploading state
    this.setState({
      stateCover: 'uploading'
    });

    var imgdata;
    this.readFileData(file)
      .then(data => {
        imgdata = data;
        return this.ipfs.fileAdd(data);
      })
      .then(res => {
        // Save the file hash
        this.setState({
          ipfs: {
            ...this.state.ipfs,
            cover: res[0].hash
          },
          stateCover: 'done',
          isDoneCover: true
        });
        // Update thumbnail image
        this.setBackgroudImageData('imageCover', imgdata);
      })
      .catch(err => {
        toast.error('Couldn\'t upload the file. Please check your IPFS settings...');
        // Rollback state
        this.setState({
          stateCover: 'init'
        });
      });
  }

  onChangeTitle(e) {
    const val = e.target.value;
    var valid = false;

    if(val && val.length >= 6) valid = true;
    this.setState({
      upload: {
        ...this.state.upload,
        title: val
      },
      validation: {
        ...this.state.validation,
        title: valid
      }
    });
  }

  onFormatTitle(e) {
    const original = e.target.value;
    // const val = xss.removeHtml(original);
    const val = e.target.value;

    if(val === original) return;

    this.setState({
      upload: {
        ...this.state.upload,
        title: val
      }
    });
  }

  onChangeDesc(e) {
    const val = e.target.value;

    this.setState({
      upload: {
        ...this.state.upload,
        desc: val
      }
    });
  }

  onFormatDesc(e) {
    const original = e.target.value;

    // var val = xss.filterHtml(original);
    var val = original;

    if(val === original) return;

    this.setState({
      upload: {
        ...this.state.upload,
        desc: val
      }
    });
  }

  onChangeType(e) {
    const val = e.target.value;
    var valid = false;

    if(val && val.length > 0) valid = true;
    this.setState({
      upload: {
        ...this.state.upload,
        type: val
      },
      validation: {
        ...this.state.validation,
        type: valid
      }
    });
  }

  onChangeGenre(e) {
    const val = e.target.value;
    var valid = false;

    if(val && val.length >= 3) valid = true;
    this.setState({
      upload: {
        ...this.state.upload,
        genre: val
      },
      validation: {
        ...this.state.validation,
        genre: valid
      }
    });
  }

  onFormatGenre(e) {
    const original = e.target.value;
    var valid = this.state.validation.genre;

    var val = original.split(',')[0];
    val = this.formatGenre(val);

    if(val === original) return;

    if(val && val.length >= 3) valid = true;
    this.setState({
      upload: {
        ...this.state.upload,
        genre: val
      },
      validation: {
        ...this.state.validation,
        genre: valid
      }
    });
  }

  onChangeTags(e) {
    const val = e.target.value;

    this.setState({
      upload: {
        ...this.state.upload,
        tags: val
      }
    });
  }

  onFormatTags(e) {
    const original = e.target.value;
    var valid = this.state.validation.tags;

    var tags = original.split(',');
    var clean = tags.map((t) => this.formatTag(t));
    var noempty = clean.filter((t) => t.length > 0);
    var val = noempty.slice(0, 4).join(', ');

    if(val === original) return;

    if(val && val.length >= 3) valid = true;
    this.setState({
      upload: {
        ...this.state.upload,
        tags: val
      },
      validation: {
        ...this.state.validation,
        tags: valid
      }
    });
  }

  onChangeDl(e) {
    const val = e.target.checked;
    var buy = this.state.upload.buy;

    if(val && buy) buy = false;

    this.setState({
      upload: {
        ...this.state.upload,
        download: val,
        buy: buy
      }
    });
  }

  onChangeDlGate(e) {
    const val = e.target.value;

    this.setState({
      upload: {
        ...this.state.upload,
        dlgate: val
      }
    });
  }

  onFormatDlGate(e) {
    const original = e.target.value;

    // var val = xss.filterUrl(original);
    var val = original;

    if(val === original) return;

    this.setState({
      upload: {
        ...this.state.upload,
        dlgate: val
      }
    });
  }

  onChangeBuy(e) {
    const val = e.target.checked;
    var download = this.state.upload.download;

    if(val && download) download = false;

    this.setState({
      upload: {
        ...this.state.upload,
        buy: val,
        download: download
      }
    });
  }

  onChangeBuyUrl(e) {
    const val = e.target.value;

    this.setState({
      upload: {
        ...this.state.upload,
        buyurl: val
      }
    });
  }

  onFormatBuyUrl(e) {
    const original = e.target.value;

    // var val = xss.filterUrl(original);
    var val = original;

    if(val === original) return;

    this.setState({
      upload: {
        ...this.state.upload,
        buyurl: val
      }
    });
  }

  doPublish(e) {
    // Turn the publish button off
    this.setState({
      isPublished: true
    });

    // Send to Steem blockchain
    this.steem.publishSound(this.state.upload, this.state.ipfs)
      .then(() => {
        toast.info('Your sound was published!');
        this.props.history.push('/new');
      })
      .catch((err) => {
        toast.error('Error publishing the sound. Please check network connection...');
        this.props.history.push('/new');
      })
  }

  doCancel(e) {
    this.props.history.push('/');
  }


  // Methods

  formatGenre(tag) {
    return tag.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15);
  }

  formatTag(tag) {
    return tag.toLowerCase().replace(/[^a-z0-9-]/g, "").substring(0, 15);
  }

  readFileData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.onerror = (e) => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  getSoundPeaks(data) {
    return new Promise((resolve, reject) => {
      // Duplicate before using, not consume the original
      // It is necessary do that the original buffer remains with the file data
      // so that it will be stored on IPFS afterwards. Otherwise the original
      // buffer would be size 0 by then...
      var dataforpeaks = new ArrayBuffer(data.byteLength);
      new Uint8Array(dataforpeaks).set(new Uint8Array(data));
      // Decode sound data
      this.soundengine.decodeArrayBuffer(dataforpeaks, decoded => {
        var duration = decoded.duration;
        var peaks = this.soundengine.getPeaksFromBuffer(decoded, 1024);
        if(peaks && peaks.length > 0) {
          resolve({peaks, duration});
        } else {
          reject(new Error('Couldn\'t get the peaks from audio data'));
        }
      });
    });
  }

  setBackgroudImageData(ref, data) {
    const div = ReactDOM.findDOMNode(this.refs[ref]);
    const objectURL = URL.createObjectURL(new Blob([new Uint8Array(data)]));
    div.style.backgroundImage = 'url('+objectURL+')';
  }


  // Component lifecycle hooks

  componentDidMount() {
    // Set title
    document.title = ' Upload Sound | DSound - Decentralized Sound Platform';
  }


  // Render

  getSoundUploader() {
    switch(this.state.stateSound) {
      default:
      case 'init':
        return (
          <div className="sound-uploader">
            <p className="sound-uploader-title drag-drop"><span>Drag files here or <a onClick={this.onSelectSoundFile}>browse</a></span></p>
            <input type="file" ref="uploadSoundFile" accept="audio/*" onChange={this.handleSoundFiles} className="hidden"/>
          </div>
        );
      case 'over':
        return (
          <div className="sound-uploader">
            <p className="sound-uploader-title">Drop here!!!</p>
            <p className="sound-uploader-text">or</p>
            <p className="sound-uploader-file">
              <Button color="primary" className="form-submit" onClick={this.onSelectSoundFile}>Select sound file</Button>
              <input type="file" ref="uploadSoundFile" hidden accept="audio/*" onChange={this.handleSoundFiles} />
            </p>
            <p className="sound-uploader-text d-md-up-none">We recommend WAV or MP3 320Kbps files...</p>
            <p className="sound-uploader-text d-sm-down-none">We recommend WAV or MP3 320Kbps files, but FLAC, OGG, MP4, AAC, any MP3, and others are also ok...</p>
          </div>
        );
      case 'processing':
        return (
          <div className="sound-uploader">
            <p className="sound-uploader-title">Processing your sound...</p>
            <div className="sound-uploader-progress">
              <ProgressBar className="sound-uploader-prog-proc" color="info" now={100} active />
              <ProgressBar className="sound-uploader-prog-upld" color="warning" now={100} active />
            </div>
            <p className="sound-uploader-file">
              <Button color="primary" className="form-submit" onClick={this.onSelectSoundFile} disabled>Change sound</Button>
              <input type="file" ref="uploadSoundFile" hidden accept="audio/*" onChange={this.handleSoundFiles} />
            </p>
          </div>
        );
      case 'uploading':
        return (
          <div className="sound-uploader">
            <p className="sound-uploader-title">Uploading to IPFS...</p>
            <div className="sound-uploader-progress">
              <ProgressBar className="sound-uploader-prog-proc" color="info" now={100} />
              <ProgressBar className="sound-uploader-prog-upld" color="warning" now={100} active />
            </div>
            <p className="sound-uploader-file">
              <Button color="primary" className="form-submit" onClick={this.onSelectSoundFile} disabled>Change sound</Button>
              <input type="file" ref="uploadSoundFile" hidden accept="audio/*" onChange={this.handleSoundFiles} />
            </p>
          </div>
        );
      case 'done':
        return (
          <div className="sound-uploader">
            <p className="sound-uploader-title">Sound uploaded!</p>
            <div className="sound-uploader-progress">
              <ProgressBar className="sound-uploader-prog-proc" color="info" now={100} />
              <ProgressBar className="sound-uploader-prog-upld" color="warning" now={100} />
            </div>
            <p className="sound-uploader-file">
              <Button color="primary" className="form-submit" onClick={this.onSelectSoundFile}>Change sound</Button>
              <input type="file" ref="uploadSoundFile" hidden accept="audio/*" onChange={this.handleSoundFiles} />
            </p>
          </div>
        );
    }
  }

  render() {
    return (
      <Col xs={12} sm={6}>
        <FormattedMessage
          id="upload:instruction">
            {(message) => <h3>{message}</h3>}
        </FormattedMessage>
        <div className="sound-uploader-panel"
          onDragOver={this.onDragOverSound}
          onDragLeave={this.onDragLeaveSound}
          onDrop={this.handleSoundFiles}>
          {this.getSoundUploader()}
        </div>
      </Col>
    );
  }
}
