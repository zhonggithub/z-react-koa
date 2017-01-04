import React from 'react';
import './style.less';

class PictureCard extends React.Component {
    static propTypes = {
        src : React.PropTypes.string,
        title: React.PropTypes.string,
        selected: React.PropTypes.bool,
        titleDirection: React.PropTypes.string, // top or bottom
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        picWidth: React.PropTypes.string,
        picHeight: React.PropTypes.string,
    }

    constructor (props) {
        super(props);
        this.state = {
            isSelected: props.selected || false,
        };
    }

    selected = () => {
        this.setState({
            isSelected: !this.state.isSelected
        });
        if(this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
      let selected = this.state.isSelected;
      if(this.props.selected !== undefined) {
        selected = this.props.selected;
      }
      const titleTmp = <div style={{width: this.props.width || '91px'}} className='hms-picture-card-title'>{this.props.title}</div>;
      return(
        <div style={{float: 'left'}}>
          {this.props.titleDirection === 'top' || !this.props.titleDirection ? titleTmp : null }
          <div className={selected ? 'hms-picture-card-select' : 'hms-picture-card'}
            onClick={this.selected}
            style={{width: this.props.width || '91px', height: this.props.height || '112px'}}
          >
            <img className="hms-layout-img"
              style={{width: this.props.picWidth || '53px', height: this.props.picHeight || '101px'}}
              src={this.props.src}/>
          </div>
          {this.props.titleDirection === 'top' || !this.props.titleDirection ? null : titleTmp}
        </div>
      );
    }
}

class PictureCardGroup extends React.Component {
    static propTypes = {
        items: React.PropTypes.array, //pictureCard的参数数组。[{title:'', src:''}]
        onSelected: React.PropTypes.func, //选择了那张图片回调函数，参数：index，表示图片在PictureCardGroup的索引值，0起偏
        defaultSelect: React.PropTypes.number, //默认选择的那个图片, index 0起偏
        titleDirection: React.PropTypes.string, // top or bottom
    }

    constructor(props) {
        super(props);
        this.state = {
          selectArray: []
        };
    }

    onSelected(src) {
      let selectArray = [];
      let selectIndex = 0;
      for(let i = 0; i < this.props.items.length; ++i){
        const item = this.props.items[i];
        if(item.src === src) {
          selectIndex = i;
          selectArray.push(true);
        }else{
          selectArray.push(false);
        }
      }
      this.setState({ selectArray });
      if(this.props.onSelected){
        this.props.onSelected(selectIndex);
      }
    }

    renderItems() {
      if(!this.props.items) {
        return null;
      }

      const selectArray = this.state.selectArray;
      let i = -1;
      return this.props.items.map( item => {
        ++i;
        let select = false;
        if(!selectArray.length && this.props.defaultSelect !== undefined && i === this.props.defaultSelect){
          select = true;
        }
        return <PictureCard key={item.src}
          titleDirection={ this.props.titleDirection }
          src={item.src}
          title={item.title}
          width={item.width}
          height={item.height}
          picWidth={item.picWidth}
          picHeight={item.picHeight}
          // selected={selectArray.length ? selectArray[i] : false}
          selected={selectArray.length ? selectArray[i] : select}
          onClick={this.onSelected.bind(this, item.src)}/>
      });
    }

    render() {
      return (
        <div>
          {this.renderItems()}
        </div>
      );
    }
}

module.exports = {
    PictureCard,
    PictureCardGroup,
}
