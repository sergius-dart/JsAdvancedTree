<?php

/**
 * JsTree widget is a Yii2 wrapper for the jsTree jQuery plugin with extended
 * functions.
 *
 * @author sergius-dart
 * @since 1.0
 */

namespace app\widgets\TreeView;

use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\bootstrap\Widget;
use yii\web\View;
use app\widgets\TreeView\JsTreeAsset;
use yii\db\Expression;

trait JsTreeControllerTrait
{

    public static $tree_modelName;

    public static $tree_idName = 'id';
    public static $tree_parentIdName = 'parent_id';
    public static $tree_iconName;

    public static $tree_textName = 'name';
    public static $tree_childrenCountName = 'children';
    //to order by 
    public static $tree_sortName;

    public function actionTree($id = null)
    {
        if (!$this->isFullInitStaticVariables())
            return null;
        
        if ( $id == '#' )
            $id = null;
        
        $parentIf = 'IF( ISNULL( `'.static::$tree_parentIdName.'` ), "#", `'.static::$tree_parentIdName.'`  )';

        $find = static::$tree_modelName::findTreeChildren($id);
        if ( isset(static::$tree_sortName ) )
            $find = $find->orderBy( static::$tree_sortName );

        //lol hack
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $result = $find->all();

        $arrResult = [];
        foreach($result as $model )
        {
            //precashe static variables
            $tree_idName = static::$tree_idName;
            $tree_childrenCountName = static::$tree_childrenCountName;
            $tree_textName = static::$tree_textName;
            $tree_iconName = static::$tree_iconName;
            
            //generate good object to jsTree
            array_push($arrResult,
                [
                    'id'=>$model->$tree_idName,
                    'parent'=>\is_null($id) ? '#' : $id,
                    'icon'=> isset($model->$tree_iconName) ? $model->$tree_iconName : null,
                    'children'=>($model->$tree_childrenCountName > 0),
                    'text' => $model->$tree_textName,
                ]
            );
        }
        return $arrResult;
    }
    
    public function actionTreeAddNode($parentId)
    {
        if (!$this->isFullInitStaticVariables())
            return null;
            
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;    
        
        if ( !method_exists(static::$tree_modelName,'treeAddNode') ||
            !is_callable( [static::$tree_modelName,'treeAddNode'] ) )
            throw ImplementationException('Not found '.static::$tree_modelName.'::treeAddNode($id)');
        
        return ['success'=>static::$tree_parentIdName::treeAddNode($parentId)];
    }
        
    public function actionTreeDelNode($id)
    {
        if (!$this->isFullInitStaticVariables())
            return null;
        
        if ( !method_exists(static::$tree_modelName,'treeDelNode') ||
            !is_callable( [static::$tree_modelName,'treeDelNode'] ) )
            throw ImplementationException('Not found '.static::$tree_modelName.'::treeDelNode($id)');
        
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;    
        
        return ['success'=>static::$tree_parentIdName::treeDelNode($id)];
    }

    private function isFullInitStaticVariables()
    {
        $message = Yii::t('app', 'Need init public static member : ');
        if ( !isset(static::$tree_modelName) )
            throw new ImplementationException($message.'$tree_modelName');
            
        if ( !isset(static::$tree_idName) )
            throw new ImplementationException($message.'$tree_idName');
            
        if ( !isset(static::$tree_parentIdName) )
            throw new ImplementationException($message.'$tree_parentIdName');
            
        if ( !isset(static::$tree_textName) )
            throw new ImplementationException($message.'$tree_textName'); 

        if ( 
            !method_exists(static::$tree_modelName,'findTreeChildren') ||
            !is_callable( [static::$tree_modelName,'findTreeChildren'] )
        )
            throw new ImplementationException(Yii::t('app','Need create static function in model : ').static::$tree_modelName.'::findTreeChildren($parentId)');
        
        return true;
    }
}
