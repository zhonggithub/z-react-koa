/*
 * @Author: Zz
 * @Date: 2017-04-15 16:29:02
 * @Last Modified by:   Zz
 * @Last Modified time: 2017-04-15 16:29:02
 */
import React from 'react';
import Editor from 'react-umeditor';
import PropTypes from 'prop-types';

export default class BaiDuUeditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    content: PropTypes.string,
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
