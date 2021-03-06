//this function will add querySelector and querySelectorAll
//for document element
function addQueries(){	
	Array.addArray = addArray;	
	document.querySelectorAll = querySelectorAllShim;	
	document.querySelector = querySelectorShim;
}

function querySelectorAllShim(selectors){
	var resultElements = new Array();
	var i;
	
	if(selectors.indexOf(",") > 0){
		var selectorsSplit = selectorsString.split(',');		
		for(i = 0; i < selectorsSplit.length; i++){
			resultElements.push(querySelectorAllShim(selectorsSplit[i]));
		}
	}
	else{
		//TODO multiple words in selector String
		//if(selectors.indexOf(" ") > 0){			 
		//}
		var selectorStr,selectorFirstChar = selectors.substr(0,1);
		switch(selectorFirstChar) {
			case "#":{
				selectorStr = selectors.substr(1);
				resultElements = searchTree(this,selectorStr,"id");
				break;
			}
			case ".":{
				selectorStr = selectors.substr(1);
				resultElements = searchTree(this,selectorStr,"class");
				break;
			}
			default:{
				selectorStr = selectors.toUpperCase();
				resultElements = searchTree(this,selectorStr);
				break;			
			}
		}		
	}
	
	return resultElements;
}

function querySelectorShim(selectors){
	var findAll = document.querySelectorAll(selectors);
	return findAll[0];
}

function searchTree(element,selector,typeOfSelector,comparer){
	//if not se typeOfSelector is set to simple
	if(!typeOfSelector){
		typeOfSelector = "simple";
	}
	
	//get comparer if not given by caller(given in recursive calling below)	
	if(!comparer){
		var comparer = getComparer(typeOfSelector);
	}
	
	var resultElementss = new Array();
	var childNodesSelected = new Array();
	var currentNode = element;
	
	while(currentNode) {	
		var selectBy = comparer(currentNode)
		if(selector === selectBy){
			resultElementss.push(currentNode);
		}
		if(currentNode.firstChild){
			childNodesSelected = searchTree(currentNode.firstChild,selector,typeOfSelector,comparer);
		}
		
		if(childNodesSelected.length > 0){
			addArray(resultElementss,childNodesSelected);
			childNodesSelected = new Array();
		}
		
		currentNode = currentNode.nextSibling;
	}
	
	return resultElementss;	
}

//returns ref to anothe function which will be the comparer
//comparer returns id,class or tagname of element defined by typeOfSelector
function getComparer(typeOfSelector){
	var comparer;
	switch(typeOfSelector){
		case "class":{			
			comparer = getClass;			
			break;
		}
		case "id":{
			comparer = getId;
			break;
		}			
		case "simple":{
			comparer = getTagName;
			break;
		}
		default:{
			alert("This is not an acceptable selector");
			break;
		}
	}
	
	return comparer;
}


function getClass(element){	 
	return element.className;
} 

function getId(element){
	return element.id;
} 

function getTagName(element){
	return element.nodeName;
} 

function addArray(arrayToBeExpanded,arrayToAdd){
	var i,len = arrayToAdd.length;
	for(i = 0;i < len;i++) {
		arrayToBeExpanded.push(arrayToAdd[i]);
	}
}
