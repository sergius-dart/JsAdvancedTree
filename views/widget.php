<?php
use yii\helpers\Html;
use yii\widgets\Pjax;
use sergiusdart\JsAdvancedTree\JsTreeAsset;
JsTreeAsset::register($this);
?>

<DIV class="col-sm-4">
    <div class="panel panel-primary">
        <div class="panel-heading" >
            <div class="panel-title">
                <SPAN class="h4"> <?= $this->context->tree['labelTree'] ?> </SPAN>
                <div id="TreeAddButton"  class="btn glyphicon glyphicon-plus pull-right" style="margin-top:-5px"></div>
                <div id="TreeCopyButton" class="btn glyphicon glyphicon-copy pull-right" style="margin-top:-5px"></div>
                <div id="TreeDelButton" class="btn glyphicon glyphicon-remove pull-right" style="margin-top:-5px"></div>
            </div>
        </div>
        <div class="table">
            <div id="jstree"></div>
        </div>
    </div>
</DIV>
<div class="col-sm-8">
    <div class="panel panel-primary">
        <div class="panel-heading" >
            <h3 class="panel-title"><?= $this->context->tree['labelDetail'] ?></h3>
        </div>
       
        <?php Pjax::begin(['enablePushState' => false,'options'=>['class'=>'jstree-result','style'=>"margin:5px 20px"]]); ?><?php Pjax::end(); ?>
        
    </div>
</div>
