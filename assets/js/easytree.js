/* Version 0.9 */
if ( typeof intsys == 'undefined' )
    intsys = {} 
if ( typeof intsys.TreeView == 'undefined' )
    intsys.TreeView = {menu:{items:{}}};
// ACTIVE RECORD VERSION
if (typeof jsonurl === 'undefined') {
    // the variable is defined
    var base_url = "/" + controller + "/";
    var jsonurl = base_url + index_action + "?easytree=fulljson";
    
    function initTree(){
        //$.getJSON(jsonurl, function (jsdata) {
            var tree = $(jstreediv).jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": {
                        "stripes": true,
                        "icons": jstreeicons
                    },
                    'data': {
                        'url' : base_url + 'tree',
                        'data' : function (node) {return {id:node.id};}
                    }
                },
                "types": jstreetype,
                "plugins": jstreeplugins,
                "contextmenu": Object.keys( intsys.TreeView.menu ).length > 0 ? intsys.TreeView.menu : {
                    "items": function () {
                        return {
                            "Edit": {
                                //"label": "Bearbeiten",
                                "icon": "fa fa-pencil",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    // tbd
                                    // allow both methods: ajax load und href link
                                    // location.href = base_url +'/update?id=' + obj.id.replace("id", "");
                                    $.ajax({
                                        type: "GET",
                                        url: base_url + '/update'  ,
                                        data:{
                                           id:obj.id.replace("id", "")
                                       },

                                        success: function (data, textStatus) {
                                            $(".result").html(data);
                                        },
                                        error: function () {
                                            alert('Error loading Page!');
                                        }
                                    })
                                }
                            },
                            "Create_menue": {
                                //"label": "Neu",
                                "icon": "glyphicon glyphicon-th-list",
                                "action": function (data) {
                                    var ref = $.jstree.reference(data.reference);
                                    sel = ref.get_selected();
                                    if (!sel.length) {
                                        return false;
                                    }
                                    sel = sel[0];
                                    sel = ref.create_node(sel, {"type": "menue"});
                                    if (sel) {
                                        ref.edit(sel);
                                    }
                                }
                            },
                            "Rename": {
                                //"label": "Umbenennen",
                                "icon": "fa fa-refresh",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    inst.edit(obj);
                                }
                            },
                            "Delete": {
                                //"label": "Löschen",
                                "icon": "fa fa-trash",
                                "action": function (data) {
                                    if (confirm("Sind Sie sicher?")) {
                                        var inst = $.jstree.reference(data.reference);
                                        obj = inst.get_node(data.reference);
                                        $.ajax({
                                            async: false,
                                            type: 'POST',
                                            dataType: "json",
                                            url: base_url,
                                            data: {
                                                "easytree": "delete",
                                                "id": obj.id.replace("id", ""),
                                            },
                                            success: function (r) {
                                                if (r.status) {
                                                    var ref = $.jstree.reference(data.reference);
                                                    sel = ref.get_selected();
                                                    if (!sel.length) {
                                                        return false;
                                                    }
                                                    ref.delete_node(sel);
                                                } else {
                                                    alert(r.error);
                                                    return false;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        };
                    }
                },
            }).on("move_node.jstree", function (e, data) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    dataType: "json",
                    url: base_url ,
                    data: {
                        "easytree": "move",
                        "id": data.node.id.replace("id", ""),
                        "position": data.position,
                        "parent": data.parent.replace("id", ""),
                    },
                    success: function (r) {
                        if (!r.status) {
                            // rollback v3 ??
                            // $.jstree.rollback(data.rlbk);
                        }
                    }
                });
            }).on("create_node.jstree", function (e, data) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    url: base_url+ "tree-add-node",
                    dataType: "json",
                    data: {
                        "parentId": data.parent.replace("id", ""),
                    },
                    success: function (r) {
                        if (r.status) {
                            data.instance.set_id(data.node.id, r.id);
                            data.instance.set_text(r.id, r.text);
                            data.instance.deselect_all();
                            data.instance.select_node(r.id);
                        } else {
                            // rollback v3 ??
                            // $.jstree.rollback(data.rlbk);
                        }
                    }
                });
            }).on("rename_node.jstree", function (e, data) {
                $.ajax({
                    async: false,
                    type: 'POST',
                    dataType: "json",
                    url: base_url,
                    data: {
                        "easytree": "rename",
                        "id": data.node.id.replace("id", ""),
                        "text": data.text,
                    },
                    success: function (r) {
                        if (!r.status) {
                            // rollback v3 ??
                            // $.jstree.rollback(data.rlbk);
                        }
                    }
                });
            }).on("select_node.jstree", function (e, data) {
                $.ajax({
                    type: "GET",
                    url: base_url + 'update?id=' + data.node.id.replace("id", ""),
                    success: function (data, textStatus) {
                        $(".jstree-result").html(data);
                        if (typeof afterLoad === "function") {
                            afterLoad();
                        }
                    },
                    error: function () {
                        // alert('Error loading Page!');
                    }
                })
            }).on('delete_node.jstree', function(e,data)
            {
                $.ajax({
                    type: "GET",
                    url: base_url + 'tree-del-node',
                   data:{
                       id:data.node.id.replace("id", "")
                   },
                    success: function (data, textStatus) {
                        $(".jstree-result").html("Pls select item.");
                        if (typeof afterLoad === "function") {
                            afterLoad();
                        }
                    },
                    error: function () {
                        // alert('Error loading Page!');
                    }
                })
            }).on('loaded.jstree', function(e,data){
                if ( !intsys.TreeView.load_id.load_id )
                    return;
                var treeObj = data.instance;
                
                var i = 0;
                
                function nextLoader()
                {
                    var callback = (i < intsys.TreeView.load_id.parents - 1) ?nextLoader : lastLoader;
                    treeObj.load_node(intsys.TreeView.load_id.parents[++i], callback);
                }
                
                function lastLoader()
                {
                    treeObj.select_node( intsys.TreeView.load_id.load_id  );
                }
                treeObj.clear_state();
                treeObj.load_node(intsys.TreeView.load_id.parents[i], nextLoader );                
            });
        //});
        $('#TreeAddSubButton').click(function(){
            console.log("Hello #TreeAddSubButton");
            var ref = $('#jstree').jstree();
            sel = ref.get_selected();
            if (!sel.length) {
                return false;
            }
            sel = sel[0];
            sel = ref.create_node(sel, {"type": "menue"});
        });
        
        $('#TreeAddRootButton').click(function(){
            console.log("Hello #TreeAddRootButton");
            var ref = $('#jstree').jstree();
            var sel = ref.create_node(null, {"type": "menue"});
        });
        
        $('#TreeCopyButton').click(function(){
            console.log("Hello #TreeCopyButton");
            var ref = $('#jstree').jstree();
            sel = ref.get_selected();
            if (!sel.length) {
                return false;
            }
            sel = sel[0];
            var node = ref.get_node(sel);
            sel = ref.create_node(node.parent, {"type": "menue"});
        });
        
        $('#TreeDelButton').click(function(){
            console.log("Hello #TreeDelButton");
            var ref = $('#jstree').jstree();
            sel = ref.get_selected();
            if (!sel.length) {
                return false;
            }
            sel = sel[0];
            var result = ref.delete_node(sel);
            if ( !result )
            {
                //trigger error!
            }
        });
        if ( intsys.TreeView.load_id )
        {
            
        }
    }
    $(document).ready(initTree);
    
    var resultArr = $('.jstree-result');
    if ( resultArr.length > 0  )
    {
        //check pjax and add callbacks to ALL 
        resultArr.on('pjax:complete', function(event, xhr, result, options ){            
            if ( result == 'success' )
            {
                var selected = $(jstreediv).jstree().get_selected(true);
                if ( selected.length != 1 )//работаем только если 1 
                    return;
                console.log(selected[0]);
                if ( selected[0].parent != '#' )
                    $(jstreediv).jstree().refresh_node( selected[0].parent );
                else
                    $(jstreediv).jstree().refresh();
            }
        })
        
    }

    /************* TREE ACTION ******************/

    /* Submitting Form Content should be send to .jstree-result div */
    $(document).on('submit', 'form.jstree-form', function (event) {
        $(".jstree-result").prepend('<div class="jstree-result-loader"><p>Sende Daten ...</p></div>');
        $.ajax({
            data: $(this).serialize(), // get the form data
            type: $(this).attr('method'), // GET or POST
            url: $(this).attr('action'), // the file to call
            success: function (response) { // on success..
                $('.jstree-result').html(response); // update the DIV
            }
        });
        return false; // cancel original event to prevent form submitting
    });

    /* Buttons or Links in Tree Form should load in result div */
    $(document).on('click', '.jstree-button', function (event) {
        $(".jstree-result").prepend('<div class="jstree-result-loader"><p>Sende Daten ...</p></div>');
        $.ajax({
            type: "GET",
            url: $(this).attr('href'),
            success: function (response) {
                $('.jstree-result').html(response);
            }
        });
        return false; // stop the browser following the link
    });

    /* Tree click Preloader */
    /* Every klick on a treeitem load the update in resonse div*/
    $(document).ready(function () {
        $(jstreediv).on("select_node.jstree", function (e, data) {
            $(".jstree-result").prepend('<div class="jstree-result-loader"><p>Lade Daten ...</p></div>');
        });
    });

// JSON ONLY VERSION
} else {

    $.getJSON(jsonurl, function (jsdata) {
        $(jstreediv).jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": {
                    "stripes": true,
                },
                'data': jsdata
            },
            "checkbox": {
                "keep_selected_style" : false,
                "three_state": false,
            },
            "plugins": [
                "types", "wholerow", "checkbox"
            ]
        })
    });
    
    $(document).on('submit','form',function(event){
        var selectedElmsIds = $(jstreediv).jstree("get_selected");
        console.log(selectedElmsIds);
        $('<input>').attr({
            type: 'hidden',
            id: 'jstree-checkboxes',
            name: 'jstree-checkboxes',
            value: selectedElmsIds.join()
        }).appendTo('form');
    });

}
