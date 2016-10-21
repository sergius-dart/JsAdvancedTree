<?php
/**
 * @link http://www.studio255.de/
 * @copyright Copyright (c) 2016 Nils Menrad
 * @license http://www.yiiframework.com/license/
 */

namespace sergiusdart\JsAdvancedTree;

use yii\web\AssetBundle;

class JsTreeBridgeAsset extends AssetBundle
{
    public $sourcePath = __DIR__ . '/assets';
    public $css = [
    ];
    public $js = [
        'js/easytree.js'
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
