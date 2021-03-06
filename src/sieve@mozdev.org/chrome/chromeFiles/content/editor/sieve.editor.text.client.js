"use strict"

if (!net)
  var net = {}
  
if (!net.tschmid)
  net.tschmid = {};
  
if (!net.tschmid.sieve)
  net.tschmid.sieve = {};

if (!net.tschmid.sieve.editor)
  net.tschmid.sieve.editor = {};

if (!net.tschmid.sieve.editor.text)
  net.tschmid.sieve.editor.text = {};  
  
if (!net.tschmid.sieve.editor.text.client)
  net.tschmid.sieve.editor.text.client = {};  

  
(function() {

  function SieveTextEditorClient(id) {  
  	this.broker = new net.tschmid.sieve.Broker(id);
  	this.id = id;
  }
  
  SieveTextEditorClient.prototype = {
  	
    broker : null,
    listener : null,
    callbacks : null,
    id : null,
    
    setListener : function(listener) {      
      this.listener = listener;
      
      var that = this;
      this.broker.setListener( function(event, data) { that.onMessage(event, data); });  	
    },
    
    
    onCallback : function(event, data) {
    	
      if (!this.callbacks)
        return;
      	
       if (!this.callbacks[event])
      	 return;
      	  
       if (!Array.isArray(this.callbacks[event]))
         return;
      	
       this.callbacks[event].forEach(
         function (element) { element(data); }
       );
       
       delete this.callbacks[event];      	
    },
    
    onListener : function(event, data) {
      
      if (!this.listener)
        return;
    
      if (event == "onChange")
        this.listener.onChange();
        
     /* if (event == "onGetScript")
        this.listener.onGetScript(data);*/
      
      if (event == "onActiveLineChange")
        this.listener.onActiveLineChange();
        
      if (event == "onStringFound")
        this.listener.onStringFound();    	
    },
    
    
    onMessage : function(event, data) {
      // we first handle call backs...
      this.onCallback(event,data);
      // and then the default listeners
      this.onListener(event,data);
    },
    
    addCallback : function(id, callback) {    
      
      if (!this.callbacks)
        this.callbacks = {};
      
      if (!this.callbacks[id])
        this.callbacks[id] = [];
        
      this.callbacks[id].push(callback);
    },
  
    loadScript : function(script, callback) {
      if (callback)
        this.addCallback("onScriptLoaded", callback);
    	
      this.broker.sendMessage("loadScript", script);
    },
    
    getScript : function(callback) 
    {
      if (callback)
        this.addCallback("onGetScript", callback);
        
      this.broker.sendMessage("getScript");
    },
  
    setScript : function(script) 
    {
  	  this.broker.sendMessage("setScript", script);
    },
    
    replaceSelection : function(text)
    {
      this.broker.sendMessage("replaceSelection",text);
    },
    
    selectAll : function()
    {
      this.broker.sendMessage("selectAll");
    },
    
    undo : function()
    {
      this.broker.sendMessage("undo");
    },
    
    redo : function()
    {
      this.broker.sendMessage("redo");
    },
    
    findString : function(token, isCaseSensitive, isReverse) 
    { 
      var data = {};
      data.token = token;
      data.isCaseSensitive = isCaseSensitive;
      data.isReverse = isReverse;
    	
      this.broker.sendMessage("findString", data);
    },
    
    replaceString : function(oldToken, newToken, isCaseSensitive, isReverse)
    {
      var data = {};
      data.oldToken = oldToken;
      data.newToken = newToken;
      data.isCaseSensitive = isCaseSensitive;
      data.isReverse = isReverse;
      
      this.broker.sendMessage("replaceString", data);
    },
    
    focus : function() {
      document.getElementById(this.id).focus();
      this.broker.sendMessage("focus");	      	
    },
    
    getStatus : function(callback) {
    
      if (!callback)
        throw "No valid callback for getStatus";
    	
      var proxy = function(msg) {
      	// we use the built in function to determin if cut, copy and paste is possible
        var controller = document.commandDispatcher.getControllerForCommand("cmd_cut");        
        msg.canCut = controller.isCommandEnabled("cmd_cut");
        
        controller = document.commandDispatcher.getControllerForCommand("cmd_copy");
        msg.canCopy = controller.isCommandEnabled("cmd_copy");
        
        controller = document.commandDispatcher.getControllerForCommand("cmd_paste");  
        msg.canPaste = controller.isCommandEnabled("cmd_paste");
        
        callback(msg);
      }
      
      this.addCallback("onGetStatus", proxy);
      this.broker.sendMessage("getStatus");
    },
    
    setOptions : function(options) {
      this.broker.sendMessage("setOptions", options);
    }
    
  }    
  
  // Export the constructor...
  net.tschmid.sieve.editor.text.Client = SieveTextEditorClient;
  
}());
  