const TAG = "VIEW_SCENE_STARTGAME";
const LOG = GS.Log.create(TAG);
const ViewMap = new Map();
import loadAudio from '../../common/loadMusics'

const ViewNames = {
    VIEW_MAIN_BG:'view_main_bg',
    VIEW_MAIN_KNOWLEDGE:'view_main_knowledge',
    VIEW_MAIN_STARTGAME:'view_main_startGame',
    VIEW_MAIN_MUTE:'view_main_mute',
    VIEW_MAIN_SHOPPING:'view_main_shopping_btn',
    VIEW_MAIN_KNAPSACK:'view_main_knapsack_btn',
    VIEW_MAIN_LIMITGAME:'view_main_limitGame',
    VIEW_MAIN_ILLUSTRATED:'view_main_illustrated'
}

const LoadViewsOnEnter = [
    ViewNames.VIEW_MAIN_BG,
    ViewNames.VIEW_MAIN_KNOWLEDGE,
    ViewNames.VIEW_MAIN_STARTGAME,
    ViewNames.VIEW_MAIN_MUTE,
    ViewNames.VIEW_MAIN_SHOPPING,
    ViewNames.VIEW_MAIN_KNAPSACK,
    ViewNames.VIEW_MAIN_LIMITGAME,
    ViewNames.VIEW_MAIN_ILLUSTRATED
]

cc.Class({
    extends: cc.Component,

    properties: {
        view_healthy_prefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //GS.KVStorage.remove('coinNum');
        //GS.KVStorage.remove('knapsack');
        if(!GS.KVStorage.loadStr('coinNum')){
            let coinNum = 100000;
            GS.KVStorage.saveStr('coinNum',coinNum);
        }
        //加载等级信息
        if(!GS.KVStorage.loadObj('GameLevelInfo')){
            cc.loader.loadRes('JSON/GameLevelInfo',(err,data)=>{
                if(err){
                    cc.error('gameLevelInfo加载失败，请检查路径是否正确');
                    return;
                }
                let gameConfig = data.json;
                GS.KVStorage.saveObj('GameLevelInfo',gameConfig);
            })
        }

        this.garbageKnowledgeArr = [];
        this.garbageKnowledgePageArr = [];
        this.root = this.node.getChildByName('root');
        this.loadViews();
        let path = 'musics/bg';
        let music_config = [{MUSIC_KEY:'musics/bg'}];
        loadAudio.loadMusicByPath(music_config,path);
    },

    loadViews(){
        LoadViewsOnEnter.forEach(viewName=>this._loadViewByViewName(viewName));
    },

    getViewByName(viewName){
        if(!ViewMap.has(viewName)) return null;
        return ViewMap.get(viewName);
    },

    _loadViewByViewName(viewName){
        cc.loader.loadRes(`prefabs/${viewName}`,(err,prefab)=>{
            let rootNode = this._getViewNodeByName(viewName);
            let viewNameNode = cc.instantiate(prefab);
            viewNameNode.parent = rootNode;

            //判断当viewName是view_main_knowledge的时候，进行相应的处理
            if(viewName == 'view_main_knowledge'){
                viewNameNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
                    if(this.garbageKnowledgePageArr.length < 1){
                        this.garbageKnowledgePage();
                        this.garbageKnowledgePageArr.push(viewNameNode);
                    }else{
                        let view_garbageKnowledgePage = this.getViewByName('view_main_knowledgePage');
                        view_garbageKnowledgePage.active = true;
                    }
                })
            }
            ViewMap.set(viewName,viewNameNode);
        });
    },

    //根据名称获取应该放置的节点位置，确定父节点
    _getViewNodeByName(viewName){
        let viewNode = this.root.getChildByName('content').getChildByName(viewName);
        if(!viewNode) return null;
        return viewNode;
    },

    //实例化并显示垃圾分类小知识页面
    garbageKnowledgePage(){
        let viewName = 'view_main_knowledgePage';
        this._loadViewByViewName(viewName);
    },

    start () {

    },

    // update (dt) {},
});
