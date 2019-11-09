
const getWordsForSearch = ( ptag, ctag ) =>{
	let words = [];
	let wordsMap = {};
	for( let i = 0; i < ctag.length; i++ ) {
		const key = ctag[i].textContent.toLowerCase();
		words.push(key);
		wordsMap[key] = ptag[i];
	};
	return {
		words,
		wordsMap
	}
}


// Make a checkbox checked by clicking anywhere on a row

$(document).ready(function() {
    $('.records tr').click(function(event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });
});

// search 
$(document).ready( () => {
	
	const searchable = $('.searchable');
	const searchableParent = $('.searchableParent');
	const searchInput = $('.search');
	const orginalRet = getWordsForSearch(searchableParent, searchable);
	const words = orginalRet.words;
	const wordsMap = orginalRet.wordsMap;
	
	const searchList = new Search(words);
	searchInput.on('keyup input propertychange paste change', function(e){
		let valueChanged = false;
		
		if (e.type=='propertychange') {
			valueChanged = ( e.originalEvent.propertyName == 'value' );
		} else {
			valueChanged = true;
		}

		if( valueChanged ){
			
			const input = $(this).val().trim().toLowerCase();
			const list = searchList.get(input);
			for( let word of words ){
				let el = wordsMap[word];
				if( list.indexOf(word) != -1 || input.length == 0){
					el.removeAttribute( 'style' );
				}else{
					el.style.display = 'none';
				}
			}
		}
	});

});

// configuring selectAll checkbox

$('#selectAll').click(function(e){
    var table= $(e.target).closest('table');
    $('td input:checkbox',table).prop('checked',this.checked);
});

//hover effect

$(document).ready(function(){
  $("article.has-background-white").hover(function(){
    $(this).addClass("has-background-white-bis");
    $(this).removeClass("has-background-white");
    $(this).children('hr.tile-design').css('border','5px solid #209cee');
    $(this).children('hr.tile-design').css('background-color','#209cee');
    }, function(){
      $(this).removeClass("has-background-white-bis");
      $(this).addClass("has-background-white");
      $(this).children('hr.tile-design').css('border','5px solid #23d160');
      $(this).children('hr.tile-design').css('background-color','#23d160');
  });
});

$('li.tab').click(function(e){
  $('li.tab').removeClass("is-active");
  $(this).addClass("is-active");
});

$('a.box').hover(function(){
  $(this).children('div.box').addClass("has-background-white-bis");
}, function(){
  $(this).children('div.box').removeClass("has-background-white-bis");
});

// Clickable modal

function openModal() {
  $('#add-category-modal').addClass('is-active');
}

function closeModal() {
  if ($('#add-category-modal').hasClass('is-active')) {
    $('#add-category-modal').removeClass('is-active');
  }
}

$('.modal-background').click(function (event) { 
  closeModal();
});

// Add Category script

function addCategory() {
  var value = $('#add-category-modal-content .field input:text').val();
  closeModal();
  $('#category-selection .control .select select').append(`<option value="${value}"> 
  ${value} 
</option>`);
}

// Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', {
  type: 'date',
  dateFormat: 'MM/DD/YYYY',
  showHeader: false,
});

const validateObj = (obj, param) => {
	if (typeof param == "string") {
	  return typeof obj == param;
	}
	if (typeof param != "object" && typeof obj != "object") {
	  return false;
	}
	let bool = true;
	for (key in param) {
	  if (obj.hasOwnProperty(key)) {
		bool = bool && param[key] == typeof obj[key];
		if (!bool) return false;
	  }
	}
	return true;
};

class Node {
	constructor() {
	  this.children = {};
	  this.isleaf = false;
	}
  
	getChildren(char) {
	  if (validateObj(char, "string") && char.length == 1) {
		if (this.children.hasOwnProperty(char)) {
		  return this.children[char];
		} else {
		  return null;
		}
	  } else {
		throw new Error("Invalid Argument");
	  }
	}
  
	getChildrenArray() {
	  return this.children;
	}
  
	setChildren(char, node) {
	  if (
		validateObj(char, "string") &&
		node instanceof Node &&
		char.length == 1
	  ) {
		this.children[char] = node;
	  } else {
		throw new Error("Invalid Argument");
	  }
	}
  
	setLeaf(lf) {
	  if (validateObj(lf, "boolean")) {
		this.isleaf = lf;
	  } else {
		throw new Error("Invalid Argument");
	  }
	}
  
	getLeaf() {
	  return this.isleaf;
	}
}
class Search {
	constructor(list) {
	  if (list instanceof Array) {
		this.node = new Node();
		this.push(list);
	  } else {
		throw new Error("list must be of type Array");
	  }
	}
  
	setNode(word) {
	  if (!validateObj(word, "string")) {
		throw new Error("list must contain Strings");
	  }
	  let tempNode = this.node;
	  for (let c of word) {
		if (tempNode.getChildren(c) != null) {
		  tempNode = tempNode.getChildren(c);
		  continue;
		}
		tempNode.setChildren(c, new Node());
		tempNode = tempNode.getChildren(c);
	  }
	  tempNode.setLeaf(true);
	}
  
	getHelper(word, pred, node) {
	  if (node.getLeaf()) {
		pred.push(word);
	  }
	  for (let c in node.getChildrenArray()) {
		const tempWord = word + c;
		if (!node.getLeaf()) {
		  this.getHelper(tempWord, pred, node.getChildren(c));
		}
	  }
	}
  
	get(word) {
	  if (validateObj(word, "string")) {
		let tempNode = this.node;
		let pred = [];
		let found = false;
		for (let c of word) {
		  if (tempNode.getChildren(c) != null) {
			tempNode = tempNode.getChildren(c);
			found = true;
		  } else {
			found = false;
		  }
		}
		if (found) {
		  this.getHelper(word, pred, tempNode);
		}
		return pred;
	  } else {
		return new Error("Word is not type of String");
	  }
	}
  
	push(words) {
	  if (words instanceof Array) {
		if (words.length != 0) {
		  words.forEach(s => {
			this.setNode(s);
		  });
		}
	  } else if (validateObj(words, "string")) {
		this.setNode(words);
	  } else {
		throw new Error("Invalid type of Argument");
	  }
	}
	
}