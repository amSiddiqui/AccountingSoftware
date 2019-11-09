const validateObj = require('./utility').validateObj;

class Node{
    constructor(){
            this.children = {};
            this.isleaf = false;
    }

    getChildren(char){
        if(validateObj(char,'string') && char.length == 1){
            if( this.children.hasOwnProperty(char) ){
                return this.children[char];
            }else{
                return null;
            }
        }else{
            throw new Error('Invalid Argument');   
        }
    }

    getChildrenArray(){
        return this.children;
    }

    setChildren(char, node){
        if(validateObj(char,'string') && node instanceof Node && char.length == 1){
            this.children[char] = node;
        }else{
            throw new Error('Invalid Argument');   
        }
    }

    setLeaf(lf){
        if(validateObj(lf,'boolean')){
            this.isleaf = lf;
        }else{
            throw new Error('Invalid Argument');   
        }
    }

    getLeaf(){
        return this.isleaf;
    }
}
class Search{
    constructor( list ){
        if( list instanceof Array ){
            this.node = new Node();
            this.push(list);
        }else{
            throw new Error("list must be of type Array");
        }

    }

    setNode(word){
        if( !validateObj(word,'string') ){
            throw new Error('list must contain Strings');
        }
        let tempNode = this.node;
        for( let c of word ){
            if( tempNode.getChildren(c) != null ) {
                tempNode = tempNode.getChildren(c);
                continue;
            }
            tempNode.setChildren(c,new Node());
            tempNode = tempNode.getChildren(c);
        }
        tempNode.setLeaf(true);
    }

   getHelper( word, pred, node){
       if( node.getLeaf() ){
            pred.push(word);
       }
       for( let c in node.getChildrenArray() ){
           const tempWord = word + c;
           if( !node.getLeaf() ){
               this.getHelper(tempWord, pred, node.getChildren(c) );
           }
       }
   }

   get(word){
       if( validateObj(word,'string') ){
           let tempNode = this.node;
           let pred = [];
           let found = false;
           for( let c of word ){
               if( tempNode.getChildren(c) != null ){
                   tempNode = tempNode.getChildren(c);
                   found = true;
               }else{
                   found = false;
               }
           }
           if( found ){
                this.getHelper(word,pred,tempNode);
           }
           return pred;
       }else{
           return new Error("Word is not type of String");
       }
   }
   push(words){
        if( words instanceof Array ){
            if( list.length != 0 ){
                list.forEach(s => {
                   this.setNode(s); 
                });
            }
        }else if ( validateObj(words,'string') ){
            this.setNode(words);
        }else{
            throw new Error('Invalid type of Argument');
        }
   }
};

module.exports = Search;