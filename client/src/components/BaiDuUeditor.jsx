var React = require('react');
var Editor = require('react-umeditor');

export default class BaiDuUeditor extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    content: React.PropTypes.string,
  }
  constructor(props){
    super(props);
  }

  getIcons(){
		return [
			"source | undo redo | bold italic underline strikethrough fontborder | ",
			"paragraph fontfamily fontsize | superscript subscript | ",
			"forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
			"cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
			"horizontal date time  | image formula spechars | inserttable"
    ];
	}
  getPlugins(){
    return {
      "image": {
        "uploader": {
          "name":"file",
          "url": "/group/api/upload"
        }
      }
    }
  }
  render(){
    var icons = this.getIcons();
    var plugins = this.getPlugins();
    return (<Editor ref="editor"
      icons={icons}
      value={this.props.content}
      onChange={this.props.onChange}
      plugins={plugins} />)
  }
}
