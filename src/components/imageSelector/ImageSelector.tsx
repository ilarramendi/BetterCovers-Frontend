
import React from "react";
import './ImageSelector.scss';

interface props {
    images: Array<any>,
    folder: string,
    selected: boolean
}
interface state {selectedImage: number}

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input: any) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    // public method for decoding
    decode : function (input: any) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string: any) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext: any) {
        var string = "";
        var i = 0;
        var c = 0;
        var c3 = 0
        var c2 = 0

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

const show = 2


export default class ImageSelector extends React.Component<props, state> {    
    constructor (p: props) {
        super(p);
        this.state = {selectedImage: Math.floor(p.images.length / 2)}
    }

    getUrl(src: string) {
        var url = 'http://192.168.1.71:3333/api/getImage?template=cover.html&languagesOrder=SPA%2CENG%2CJPN%2CPOR%2CFRE%2CITA%2CDAN%2CKOR%2CRUS%2CSWE%2CZHO%2CHIN%2CAZE%2CIND%2CDUT%2CPOL'
        url += '&image=' + encodeURIComponent(src) + '&folder=' + encodeURIComponent(this.props.folder)
        return url
    }

    render() {
        return (
            this.props.images.length > 0 &&
            <div className={'imageSelectorContainer ' + (this.props.selected && 'selectedRow')} style={{"marginTop": ((Math.max(0, 2 - this.state.selectedImage) - 0.5) * (this.props.selected ? 330 : 300) - (this.props.selected ? 35 : 0)) + 'px'}}>
                {this.props.images.slice(Math.max(this.state.selectedImage - show, 0), this.state.selectedImage).map((img: any, i: number) => <img 
                        key={i}
                        onClick={() => this.setState({selectedImage: Math.max(this.state.selectedImage - show, 0) + i})}
                        src={"/imageCache/" + Base64.encode(img['src'].replace('/original/', '/w200/')) + '.jpg'}
                        unselectable="on"
                    />
                )}
                {this.props.images.length > this.state.selectedImage && <img 
                        className="selected" 
                        style={{"backgroundImage": "url('" + this.props.images[this.state.selectedImage]['src'] + "')"}} 
                        key={this.state.selectedImage} 
                        src={this.getUrl(this.props.images[this.state.selectedImage]['src'])} 
                        onDoubleClick={() =>  window.open(this.getUrl(this.props.images[this.state.selectedImage]['src']), "_blank")} 
                        unselectable="on"
                    />}
                {this.props.images.slice(this.state.selectedImage + 1, this.state.selectedImage + show + 1).map((img: any, i: number) => <img 
                        key={i + this.state.selectedImage + 1} 
                        onClick={() => this.setState({selectedImage: i + this.state.selectedImage + 1})} 
                        src={"/imageCache/" + Base64.encode(img['src'].replace('/original/', '/w200/')) + '.jpg'} 
                        unselectable="on"
                    />
                )}
            </div>)
    }
}