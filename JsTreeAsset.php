<?php 
/**
 * @link http://www.studio255.de/
 * @author Nils Menrad
 * @since 1.0
 * @see http://jstree.com
 */

namespace sergiusdart\JsAdvancedTree;
use yii\web\AssetBundle;

class JsTreeAsset extends AssetBundle
{
    public $sourcePath = '@bower/jstree';
    public $js = [
        'dist/jstree.js',
    ];
    public $css = [
        'dist/themes/default/style.css',
    ];
    public $depends = [
        'yii\web\JqueryAsset',
        'sergiusdart\JsAdvancedTree\JsTreeBridgeAsset'
    ];
}
