import React from 'react';
import { Icon, Modal, } from 'antd';

class ImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  handlePreviewCancel = () => {
    this.setState({ previewVisible: false });
  }

  onImageClick(url) {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  onImageDelClick(url) {
    let fileList = this.state.fileList;
    for(let j = 0; j<fileList.length; ++j) {
      const item = fileList[j];
      if(item === url){
        fileList.splice(j, 1);
        break;
      }
    }
    //document.getElementById('inputFile').innerHTML = "<input   name=ab   type=file>";
    // document.getElementById('inputFile').files = {};
    this.setState({ fileList });
  }

  renderPreview() {
    const fileList = this.state.fileList;
    if(!fileList.length)
      return null;
    let i = 0;
    return fileList.map(item => {
      ++i;
      return (
        <div style={{
            float: 'left',
            border: '1px solid #d9d9d9',
            //padding: '5px',
            position:'relative',
            margin: '0 5px',
            width:"80px",
            height:'80px',
          }}
          key={`${i}${Date.now()}`}
         >
            <img className="hms-def-picture-appear-img"
              onClick={this.onImageClick.bind(this, item)}
              src={item}/>
            <Icon type='close-circle-o'
              className="hms-def-picture-appear-close-icon"
              onClick={this.onImageDelClick.bind(this, item)}
             />
             <Modal
              visible={this.state.previewVisible}
              footer={null}
              onCancel={this.handlePreviewCancel}>
               <img alt="example" src={this.state.previewImage} />
             </Modal>
        </div>
      )
    });

  }

  onImgChange = (img) => {
    //TODO: 上传图片，成功后将服务返回的URL加入fileList中
    let fileList = this.state.fileList;
    let imgUrl = 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png';
    fileList.push(imgUrl);
    this.setState({ fileList });
  }

  render() {
    return (
      <div>
        {this.renderPreview()}
        <div className="input-file">
          <span className="text"><Icon type='plus' style={{fontSize: '28px', color: '#999'}} /></span>
          <input id='inputFile'
            className="file"
            type="file"
            onChange={this.onImgChange}
            //onChange={this.props.onChange}
          />
        </div>
      </div>
    );
  }
}

module.exports = { ImgUpload, }
