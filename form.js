/**
 * 提交表单
 * @param  {Object} options {
 *      el:获取表单元素的方法，如'#form'
 *      url:提交的url,
 *      method:提交方式，默认为GET,
 *      success:请求成功的回调,
 *      fail:请求失败的回调,
 *      jsonType:请求数据返回的数据类型，默认为true
 *      data:附加数据，可不填
 *      debug:是否显示表单数据,默认为false
 * }
 * @return {false}         [description]
 */
function sendForm(options) {
	var url=options.url,
		el=options.el,
		method=options.method||'GET',
		data=options.data||{},
		success=options.success,
		fail=options.fail,
		jsonType=options.jsonType||true,
		debug=options.debug||false,
		str;
	var xhr=new XMLHttpRequest(),
		formEl=document.querySelectorAll(el)[0],
		encodeForm=function(el) {
			var i,j,len,optLen,option,optValue,filed=null;
			for(i=0,len=formEl.elements.length;i<len;i++) {
				field=formEl.elements[i];
				switch(field.type) {
					case "select-one":
					case "select-multiple":
						if(field.name.length) {
							for(j=0,optLen=field.options.length;j<optLen;j++) {
								option=field.options[j];
								if(option.selected) {
									optValue=option.value?option.value:option.text;
									data[field.name]?data[field.name].push(optValue):data[field.name]=[field.value];
								}
							}
						}
						break;
					case 'underfined':
					case "file":
					case "submit":
					case "reset":
					case "button":
						break;
					case "radio":
					case "checkbox":
						if(field.checked) {
							data[field.name]?data[field.name].push(field.value):data[field.name]=[field.value];
						}
						break;
					default:
						if(field.name.length) {
							data[field.name]=field.value;
						}
				}
			}
			if(debug) {
				console.log(data);
			}
		};
		//防止表单提交时跳转
    formEl.setAttribute('onSubmit','return false');
    if(!el||!url||!success) {
		throw new Error('缺少相应的参数');
	}
	/*提取表单数据*/
	(function() {
		encodeForm(el);
		if(method=="GET") {
		    if(url.indexOf("?")==-1) {
		        str="?";
		    }
		}
		if(typeof data=="object") {
		    for(var prop in data) {
		        if(data.hasOwnProperty(prop)) {
		        	if(Array.isArray(data[prop])) {
		        		for(var i=0,len=data[prop].length;i<len;i++) {
		        			str+=encodeURIComponent(prop)+"="
		        		           +encodeURIComponent(data[prop][i])+"&";
		        		}
		        	} else {
		        		str+=encodeURIComponent(prop)+"="+encodeURIComponent(data[prop])+"&";
		        	}
		        }
		    }
		    data=str;
		    if(method=="GET") {
		      url+=str;
		     }
		  }
	})();
	xhr.open(method,url,true);
	xhr.onreadystatechange=function() {
      if(xhr.readyState==4) {
        if((xhr.status>=200&&xhr.status<300)||xhr.status==304) {
          if(jsonType) {
            success(JSON.parse(xhr.responseText));
          } else {
            success(xhr.responseText||xhr.responseXML);
          }
          xhr=null;
        } else {
          fail(xhr.status);
        }
      }
    }
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(data);
    
    return false;
}