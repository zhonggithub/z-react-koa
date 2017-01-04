import React from 'react';
import { Select } from 'antd';
import { administrativeDistrict } from '../common';

const Option = Select.Option;

export default class DefDistrict extends React.Component {
  static PropTypes = {
    onChange: React.PropTypes.func,
    level: React.PropTypes.number,
    address: React.PropTypes.shape({
      province: React.PropTypes.string,
      city: React.PropTypes.string,
      district: React.PropTypes.string,
    }),
  }
  constructor(props) {
   super(props);
   let cities = administrativeDistrict.city[administrativeDistrict.province[0]];
   if(props.address && props.address.province)
    cities = administrativeDistrict.city[props.address.province];
   this.state = {
     value: props.value || props.defautValue || [],
     inputValue: '',
     options: [],
     cities,
     districts: [],// administrativeDistrict.district[administrativeDistrict.city[administrativeDistrict.province[0]]][0],
     city: props.address ? props.address.city || '1000' : '1000', // administrativeDistrict.city[administrativeDistrict.province[0]][0],
     district: props.district ? props.district || '1000' : '1000',
     province: props.province ? props.province || '1000' : '1000', // administrativeDistrict.province[0],
     level: props.level || 3,
     address: props.address,
   };
 }

 setValue = (value, selectedOptions = []) => {
   this.setState({ value });
   this.props.onChange(value, selectedOptions);
 }

 handleProvinceChange = (value) => {
   let districts = [];
   let district = '';
   if(value !== '1000' && {}.hasOwnProperty.call(administrativeDistrict.district, administrativeDistrict.city[value][0])) {
     districts = administrativeDistrict.district[administrativeDistrict.city[value][0]];
     //district = administrativeDistrict.district[administrativeDistrict.city[value][0]][0];
   }

   let cities = [];
   let city = '1000';
   if(value !== '1000' && {}.hasOwnProperty.call(administrativeDistrict.city, value)) {
     cities = administrativeDistrict.city[value];
     //city = administrativeDistrict.city[value][0];
   }

   this.setState({
     province: value,
     cities,
     city,
     districts,
     district,
  });

  if(this.props.onChange) {
    this.props.onChange({
      province: value,
      city,
      district,
    });
  }
 }

  onCityChange = (value) => {
    let district = '1000';
    let districts = [];
    if({}.hasOwnProperty.call(administrativeDistrict.district, value)) {
      districts = administrativeDistrict.district[value];
      //district = administrativeDistrict.district[value][0];
    }
    this.setState({
      city: value,
      districts,
      district,
    });

    if(this.props.onChange) {
      this.props.onChange({
        province: this.state.province,
        city: value,
        district,
      });
    }
  }

  onDictrictChange = (value) => {
    this.setState({
      district: value,
    });

    if(this.props.onChange) {
      this.props.onChange({
        province: this.state.province,
        city: this.state.city,
        district: value,
      });
    }
  }

  renderDistrictSelect(){
    const defaultValue = this.props.address ? this.props.address.district : this.state.district;
    const value = this.state.city;
    if({}.hasOwnProperty.call(administrativeDistrict.district, value)) {
      let districtOptions = [<Option key='1000'>区</Option>];
      districtOptions = districtOptions.concat(this.state.districts.map(district => <Option key={district}>{district}</Option>));
      return (
        <Select value={this.state.district === '1000' ? defaultValue || this.state.district : this.state.district} style={{ width: 150 }} onChange={this.onDictrictChange}>
          {districtOptions}
        </Select>
      );
    }else {
      return null;
    }
  }

  renderProvince() {
   const defaultValue = this.props.address ? this.props.address.province : this.state.province;
   let provinceOptions = [<Option key='1000'>省</Option>];
   const opts = provinceOptions.concat(administrativeDistrict.province.map(province => <Option key={province}>{province}</Option>))
   return (
     <Select value={ this.state.province === '1000' ? defaultValue || this.state.province : this.state.province} style={{ width: 150, marginRight: '5px' }} onChange={this.handleProvinceChange}>
       { opts }
     </Select>
   );
  }

  renderCity() {
   const defaultValue = this.props.address ? this.props.address.city : this.state.city;
   let cityOptions = [<Option key='1000'>市</Option>];
   this.state.city = this.state.city === '1000' ? defaultValue || this.state.city : this.state.city;
   if(this.state.city !== '1000') {
     this.state.districts = administrativeDistrict.district[this.state.city];
   }
   let cities = this.state.cities;
   if(this.props.address && this.props.address.province && this.state.province === '1000')
    cities = administrativeDistrict.city[this.props.address.province];
   const opts = cityOptions.concat(cities.map(city => <Option key={city}>{city}</Option>))
   return (
     <Select value={this.state.city} style={{ width: 150, marginRight: '5px' }} onChange={this.onCityChange}>
       { opts }
     </Select>
   );
  }

 render() {
   return (
     <div>
       { this.renderProvince() }
       { this.state.level >= 2 ? this.renderCity() : null }
       { this.state.level >= 3 ? this.renderDistrictSelect() : null }
     </div>
  );
 }
}
