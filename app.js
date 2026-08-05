(() => {
  'use strict';

  const rootNode = document.getElementById('root');
  if (!window.React || !window.ReactDOM || !window.MaterialUI || !window.htm) {
    rootNode.innerHTML = '<div class="boot-shell"><img src="./setline-s.svg" width="72" height="72" alt="Setline"><strong>Setline could not start</strong><span>Connect to the internet once, then refresh. The React and Material UI files are cached afterward.</span></div>';
    return;
  }

  const { useState, useEffect, useMemo, useRef, useCallback } = React;
  const html = htm.bind(React.createElement);
  const {
    ThemeProvider, createTheme, CssBaseline, Box, Stack, Card, CardContent, Typography, Button,
    IconButton, Chip, Divider, TextField, MenuItem, Checkbox, FormControlLabel, Dialog,
    DialogTitle, DialogContent, DialogActions, AppBar, Toolbar, BottomNavigation,
    BottomNavigationAction, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    LinearProgress, CircularProgress, Snackbar, Alert, Tooltip, Switch, ToggleButton,
    ToggleButtonGroup, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, Badge,
    Stepper, Step, StepLabel, Slider, InputAdornment, Avatar, Paper, useMediaQuery, SvgIcon
  } = MaterialUI;

  const APP_VERSION = '6.6.0';
  const RELEASE_DATE = 'August 5, 2026';
  const STORAGE_KEY = 'setline-data-v1';
  const BACKUP_KEY = 'setline-data-last-good-v1';
  const PRE_MIGRATION_KEY = 'setline-pre-v6.6-backup';
  const LEGACY_KEYS = ['setline-fitness-v6-2','setline-fitness-v6-1','setline-fitness-v6','pulse-fitness-v6','pulse-fitness-v5','pulse-fitness-v2'];

  const ICONS = {
    home:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    workout:'M20.57 14.86 22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 10.57 4.86 4.86 10.57 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 15.57 22 14.14 20.57 12.71 19.14 14.14z',
    nutrition:'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 1.79-5 4z',
    progress:'M3 17h4v4H3v-4zm7-7h4v11h-4V10zm7-7h4v18h-4V3z',
    profile:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    add:'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    check:'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    delete:'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z',
    edit:'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    info:'M11 17h2v-6h-2v6zm1-14a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14zm-1-9h2V7h-2v3z',
    calendar:'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z',
    copy:'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
    download:'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    upload:'M5 17h14v-2H5v2zM9 8h3v5h2V8h3l-4-4-4 4z',
    book:'M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H6V4h5v7l2.5-1.5L16 11V4h2v16z',
    palette:'M12 3a9 9 0 000 18h1.5a1.5 1.5 0 000-3H12a2 2 0 010-4h5a4 4 0 004-4c0-3.87-4.03-7-9-7zM6.5 12A1.5 1.5 0 118 10.5 1.5 1.5 0 016.5 12zm2-4A1.5 1.5 0 1110 6.5 1.5 1.5 0 018.5 8zm4-1A1.5 1.5 0 1114 5.5 1.5 1.5 0 0112.5 7zm4 2A1.5 1.5 0 1118 7.5 1.5 1.5 0 0116.5 9z',
    rest:'M12 3a9 9 0 109 9c0-.46-.04-.91-.1-1.35A7 7 0 1113.35 3.1C12.91 3.04 12.46 3 12 3z',
    search:'M9.5 3a6.5 6.5 0 104.09 11.55L19.04 20 20.5 18.54l-5.45-5.45A6.5 6.5 0 009.5 3zm0 2a4.5 4.5 0 110 9 4.5 4.5 0 010-9z',
    close:'M18.3 5.71 16.89 4.29 12 9.17 7.11 4.29 5.7 5.71 10.59 10.59 5.7 15.48 7.11 16.89 12 12 16.89 16.89 18.3 15.48 13.41 10.59z',
    chevron:'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z',
    spark:'M12 2l1.55 5.45L19 9l-5.45 1.55L12 16l-1.55-5.45L5 9l5.45-1.55L12 2zm7 12l.9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14z'
  };

  function Icon({name, ...props}) {
    return html`<${SvgIcon} ...${props}><path d=${ICONS[name] || ICONS.info}></path></${SvgIcon}>`;
  }

  function localDateKey(date = new Date()) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }
  function dateFromKey(key) { const [y,m,d] = String(key).split('-').map(Number); return new Date(y,m-1,d,12); }
  function shiftDateKey(key, amount) { const d=dateFromKey(key); d.setDate(d.getDate()+amount); return localDateKey(d); }
  function formatDate(key, options={weekday:'short',month:'short',day:'numeric'}) { return dateFromKey(key).toLocaleDateString(undefined,options); }
  function mondayOf(key=localDateKey()) { const d=dateFromKey(key); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return localDateKey(d); }
  function id(prefix='id') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function clamp(n,min,max){ return Math.min(max,Math.max(min,Number(n)||0)); }
  function round1(n){ return Math.round((Number(n)||0)*10)/10; }
  function deepClone(value){ return typeof structuredClone==='function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)); }
  function recordCount(data){ return Object.values(data?.days||{}).reduce((sum,day)=>sum+(day?.workouts?.length||0)+(day?.calories?.length||0)+(day?.sessions?.length||0),0); }
  function getDay(data,key){ const day=data?.days?.[key]||{}; return {workouts:Array.isArray(day.workouts)?day.workouts:[],calories:Array.isArray(day.calories)?day.calories:[],sessions:Array.isArray(day.sessions)?day.sessions:[],...day}; }
  function getSets(workout){
    if(Array.isArray(workout?.setEntries) && workout.setEntries.length) return workout.setEntries.map((set,index)=>({id:set.id||id('set'),load:Number(set.load??set.weight??0),reps:Number(set.reps??0),done:set.done!==false,type:set.type||'working',rir:set.rir??'',rpe:set.rpe??'',note:set.note||'',index}));
    const count=Math.max(1,Number(workout?.sets)||1); return Array.from({length:count},(_,index)=>({id:id('set'),load:Number(workout?.load||0),reps:Number(workout?.reps||0),done:true,type:'working',rir:'',rpe:'',note:'',index}));
  }
  function setVolume(set){ return set.done===false || set.type==='warmup' ? 0 : (Number(set.load)||0)*(Number(set.reps)||0); }

  const DEFAULT_TARGETS = {upper_chest:4,chest:6,lats:8,upper_back:6,lower_back:3,front_delts:3,side_delts:6,rear_delts:5,biceps:6,triceps:6,forearms:3,quads:8,hamstrings:6,glutes:6,calves:6,core:5};
  const REGION_META = {
    upper_chest:['Upper chest','Push'],chest:['Chest','Push'],lats:['Lats','Pull'],upper_back:['Upper back','Pull'],lower_back:['Lower back','Pull'],front_delts:['Front delts','Push'],side_delts:['Side delts','Push'],rear_delts:['Rear delts','Pull'],biceps:['Biceps','Pull'],triceps:['Triceps','Push'],forearms:['Forearms','Pull'],quads:['Quads','Legs'],hamstrings:['Hamstrings','Legs'],glutes:['Glutes','Legs'],calves:['Calves','Legs'],core:['Core','Core']
  };
  const EXERCISE_MAP = [
    [/incline.*press|incline.*fly|low.to.high/i,['upper_chest'],['front_delts','triceps']],
    [/bench press|chest press|push.?up|pec deck|chest fly|cable fly|dumbbell press/i,['chest'],['front_delts','triceps']],
    [/overhead press|shoulder press|arnold press/i,['front_delts'],['side_delts','triceps']],
    [/lateral raise|upright row/i,['side_delts'],['front_delts']],
    [/rear delt|reverse fly|face pull/i,['rear_delts'],['upper_back']],
    [/lat pulldown|pull.?up|chin.?up|straight.arm pulldown/i,['lats'],['biceps','upper_back']],
    [/row|t.bar|seal row/i,['upper_back','lats'],['biceps','rear_delts']],
    [/deadlift|back extension|good morning/i,['lower_back','glutes','hamstrings'],['upper_back']],
    [/biceps|curl|preacher|hammer/i,['biceps'],['forearms']],
    [/triceps|pushdown|skull crusher|dip|overhead extension/i,['triceps'],['chest','front_delts']],
    [/wrist|farmer|grip/i,['forearms'],[]],
    [/squat|leg press|hack squat|leg extension|split squat|lunge/i,['quads'],['glutes']],
    [/romanian|rdl|leg curl|hamstring/i,['hamstrings'],['glutes','lower_back']],
    [/hip thrust|glute bridge|kickback/i,['glutes'],['hamstrings']],
    [/calf/i,['calves'],[]],
    [/crunch|plank|sit.?up|ab wheel|leg raise|pallof/i,['core'],[]]
  ];
  const REGION_SUGGESTIONS={upper_chest:['incline dumbbell press','low-to-high cable fly'],chest:['chest press','cable fly'],lats:['lat pulldown','single-arm pulldown'],upper_back:['chest-supported row','seated cable row'],lower_back:['back extension','Romanian deadlift'],front_delts:['overhead press','Arnold press'],side_delts:['cable lateral raise','dumbbell lateral raise'],rear_delts:['reverse fly','face pull'],biceps:['preacher curl','incline curl'],triceps:['overhead extension','rope pushdown'],forearms:['hammer curl','farmer carry'],quads:['hack squat','leg extension'],hamstrings:['Romanian deadlift','leg curl'],glutes:['hip thrust','Bulgarian split squat'],calves:['standing calf raise','seated calf raise'],core:['cable crunch','ab wheel']};

  function classifyExercise(name=''){
    const found=EXERCISE_MAP.find(([pattern])=>pattern.test(name));
    return found ? {primary:found[1],secondary:found[2]} : {primary:[],secondary:[]};
  }

  const GUIDE_ITEMS = [
    {term:'RIR',title:'Reps in Reserve',summary:'How many clean reps you could still perform when the set ends.',example:'60 kg × 8 with two good reps left = RIR 2.',tags:['effort','working set']},
    {term:'RPE',title:'Rate of Perceived Exertion',summary:'A 1–10 effort scale. In resistance training, RPE 10 means no clean reps remained.',example:'RPE 8 is usually close to RIR 2; RPE 9 is close to RIR 1.',tags:['effort','rir']},
    {term:'AMRAP',title:'As Many Reps As Possible',summary:'Perform as many technically clean reps as possible under the stated limit.',example:'AMRAP at RIR 1 means stop when only one clean rep remains—not necessarily absolute failure.',tags:['set type']},
    {term:'Drop set',title:'Drop Set',summary:'Reduce the load immediately after a set and continue with little or no rest.',example:'Lateral raise 10 kg × 10, then 7.5 kg × 8.',tags:['set type','intensity']},
    {term:'Warm-up',title:'Warm-up Set',summary:'A lighter preparation set used to rehearse technique and prepare joints and muscles.',example:'Warm-ups are excluded from Setline hard-set and muscle-region totals.',tags:['set type']},
    {term:'Working set',title:'Working Set',summary:'A challenging set that counts toward the main training stimulus.',example:'Your programmed 3 sets of 8–12 are working sets after warm-ups.',tags:['set type']},
    {term:'Failure',title:'Training to Failure',summary:'The point where another clean repetition cannot be completed through the intended range.',example:'Technique breakdown is not a requirement; stop when the next clean rep is not possible.',tags:['effort']},
    {term:'Superset',title:'Superset',summary:'Two exercises performed back-to-back before resting.',example:'Lateral raises marked Group A followed by triceps pushdowns marked Group A.',tags:['group']},
    {term:'Deload',title:'Deload',summary:'A planned reduction in training stress to manage accumulated fatigue.',example:'Keep the movements but reduce load, sets, or effort for several sessions.',tags:['recovery']},
    {term:'Active recovery',title:'Active Recovery',summary:'Low-intensity movement used instead of a normal hard workout.',example:'Easy walking, light cycling, or mobility work.',tags:['recovery']},
    {term:'Progressive overload',title:'Progressive Overload',summary:'Gradually increase training demand while technique and recovery remain acceptable.',example:'Add one rep, a small amount of load, or an additional set—not everything at once.',tags:['progression']}
  ];

  const CHANGELOG = [
    {version:'6.6.0',date:RELEASE_DATE,items:['Complete React and Material UI interface rebuild','Light, dark and system themes','Faster workout logging with previous-set prefilling','Searchable Training Guide with contextual explanations','Explainable weekly muscle-region coaching','Redesigned nutrition day view and food editor','Unified Progress hub, onboarding, changelog and data tools','Automatic pre-migration backup and non-destructive storage migration']},
    {version:'6.5.3',date:'August 2026',items:['Readiness guidance','Completion and streak animations','Deep navy visual refresh','Update and data-integrity tools']},
    {version:'6.5.2',date:'August 2026',items:['Rest days, active recovery and deloads','Weekly training calendar','Recovery check-in','Responsive safe-area layout']},
    {version:'6.5.1',date:'August 2026',items:['Saved meals, recipes, favourites and barcode lookup','Private habit counter','Nutrition improvements']}
  ];

  function defaultState(){
    return {
      days:{}, calorieGoal:3200, proteinGoal:160, carbsGoal:420, fatGoal:95,
      routines:{}, preferredUnit:'kg', bodyWeightKg:72, bodyWeights:{}, autoRest:true,
      restSeconds:90, machineProfiles:{}, liveSession:null, workoutDrafts:{},
      profile:{name:'',goal:'build_muscle',experience:'intermediate',split:'push_pull_legs',trainingDays:4,equipment:['commercial_gym'],avoid:'',notes:''},
      regionTargets:{...DEFAULT_TARGETS}, foodLibrary:[], favoriteFoods:[], recentFoods:[], savedMeals:[],
      privateHabit:{enabled:false,label:'Private habit',startDate:'',personalBest:0,hideCount:true},
      schedule:{}, weeklyPlan:['push','pull','legs','rest','push','pull','rest'], autoShiftMissed:true,
      recovery:{}, scheduleMeta:{configured:false,lastProcessed:''},
      settings:{theme:'system',reducedMotion:false,haptics:true,advancedDefault:false,highContrast:false},
      onboardingComplete:false, changelogSeen:'', schemaVersion:6, updatedAt:null
    };
  }

  function normaliseState(parsed){
    const fallback=defaultState();
    if(!parsed||typeof parsed!=='object') return fallback;
    return {
      ...fallback,...parsed,
      days:parsed.days&&typeof parsed.days==='object'?parsed.days:{},
      routines:parsed.routines&&typeof parsed.routines==='object'?parsed.routines:{},
      bodyWeights:parsed.bodyWeights&&typeof parsed.bodyWeights==='object'?parsed.bodyWeights:{},
      machineProfiles:parsed.machineProfiles&&typeof parsed.machineProfiles==='object'?parsed.machineProfiles:{},
      workoutDrafts:parsed.workoutDrafts&&typeof parsed.workoutDrafts==='object'?parsed.workoutDrafts:{},
      profile:{...fallback.profile,...(parsed.profile||{})},
      regionTargets:{...fallback.regionTargets,...(parsed.regionTargets||{})},
      foodLibrary:Array.isArray(parsed.foodLibrary)?parsed.foodLibrary:[],
      favoriteFoods:Array.isArray(parsed.favoriteFoods)?parsed.favoriteFoods:[],
      recentFoods:Array.isArray(parsed.recentFoods)?parsed.recentFoods:[],
      savedMeals:Array.isArray(parsed.savedMeals)?parsed.savedMeals:[],
      privateHabit:{...fallback.privateHabit,...(parsed.privateHabit||{})},
      schedule:parsed.schedule&&typeof parsed.schedule==='object'?parsed.schedule:{},
      weeklyPlan:Array.isArray(parsed.weeklyPlan)&&parsed.weeklyPlan.length===7?parsed.weeklyPlan.slice(0,7):fallback.weeklyPlan,
      recovery:parsed.recovery&&typeof parsed.recovery==='object'?parsed.recovery:{},
      scheduleMeta:{...fallback.scheduleMeta,...(parsed.scheduleMeta||{})},
      settings:{...fallback.settings,...(parsed.settings||{})},
      preferredUnit:parsed.preferredUnit==='lb'?'lb':'kg',
      calorieGoal:Number(parsed.calorieGoal)||fallback.calorieGoal,
      proteinGoal:Number(parsed.proteinGoal)||fallback.proteinGoal,
      carbsGoal:Number(parsed.carbsGoal)||fallback.carbsGoal,
      fatGoal:Number(parsed.fatGoal)||fallback.fatGoal,
      bodyWeightKg:Number(parsed.bodyWeightKg)||fallback.bodyWeightKg,
      restSeconds:clamp(parsed.restSeconds||fallback.restSeconds,15,600),
      schemaVersion:6
    };
  }

  function parseCandidate(raw){
    if(!raw) return null;
    try{
      const parsed=JSON.parse(raw); const candidate=parsed?.data&&typeof parsed.data==='object'?parsed.data:parsed;
      if(!candidate||typeof candidate!=='object') return null;
      return normaliseState(candidate);
    }catch(err){ return null; }
  }

  function mergeStates(preferred,incoming){
    if(!preferred) return normaliseState(incoming);
    const result=normaliseState(preferred), other=normaliseState(incoming);
    for(const date of new Set([...Object.keys(other.days||{}),...Object.keys(result.days||{})])){
      const a=result.days[date]||{},b=other.days[date]||{};
      const mergeArray=(x=[],y=[])=>{const out=[...x],seen=new Set(out.map(v=>String(v.id||`${v.name}|${v.loggedAt||v.kcal||''}`)));for(const item of y){const key=String(item.id||`${item.name}|${item.loggedAt||item.kcal||''}`);if(!seen.has(key)){seen.add(key);out.push(item);}}return out;};
      result.days[date]={...b,...a,workouts:mergeArray(a.workouts,b.workouts),calories:mergeArray(a.calories,b.calories),sessions:mergeArray(a.sessions,b.sessions)};
    }
    result.routines={...other.routines,...result.routines}; result.bodyWeights={...other.bodyWeights,...result.bodyWeights};
    result.machineProfiles={...other.machineProfiles,...result.machineProfiles}; result.workoutDrafts={...other.workoutDrafts,...result.workoutDrafts};
    return result;
  }

  function loadState(){
    let loaded=null;
    try{
      const existingRaw=localStorage.getItem(STORAGE_KEY);
      if(existingRaw && !localStorage.getItem(PRE_MIGRATION_KEY)){
        const existingParsed=JSON.parse(existingRaw);
        localStorage.setItem(PRE_MIGRATION_KEY,JSON.stringify({app:'Setline',version:APP_VERSION,backedUpAt:new Date().toISOString(),data:existingParsed?.data||existingParsed}));
      }
      loaded=parseCandidate(existingRaw);
    }catch(err){}
    if(!loaded){
      for(const key of [...LEGACY_KEYS,BACKUP_KEY]){
        let candidate=null; try{candidate=parseCandidate(localStorage.getItem(key));}catch(err){}
        if(candidate) loaded=mergeStates(loaded,candidate);
      }
    }
    loaded=loaded||defaultState();
    if(Number(loaded.schemaVersion||1)<6 || !loaded.settings){
      try{localStorage.setItem(PRE_MIGRATION_KEY,JSON.stringify({app:'Setline',version:APP_VERSION,backedUpAt:new Date().toISOString(),data:loaded}));}catch(err){}
    }
    loaded=normaliseState(loaded); loaded.schemaVersion=6;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(loaded));}catch(err){}
    return loaded;
  }

  function persistState(data){
    try{
      const oldRaw=localStorage.getItem(STORAGE_KEY); const old=parseCandidate(oldRaw);
      if(oldRaw) localStorage.setItem(BACKUP_KEY,oldRaw);
      if(old && recordCount(old)>0 && recordCount(data)===0){
        console.warn('Setline blocked an unexpected empty-state overwrite.'); return false;
      }
      localStorage.setItem(STORAGE_KEY,JSON.stringify({...data,schemaVersion:6,updatedAt:new Date().toISOString()}));
      return true;
    }catch(err){console.error(err);return false;}
  }

  function planForDate(data,key){
    const override=data.schedule?.[key]; if(override) return typeof override==='string'?override:(override.type||'rest');
    const monday=mondayOf(key); const index=Math.round((dateFromKey(key)-dateFromKey(monday))/86400000);
    return data.weeklyPlan?.[index]||'rest';
  }
  function isRestType(type){return ['rest','active_recovery','deload'].includes(type);}
  function calculateStreak(data){
    if(recordCount(data)===0 && !data.scheduleMeta?.configured) return 0;
    let key=localDateKey(); const todayPlan=planForDate(data,key); const today=getDay(data,key);
    if(!today.workouts.length&&!today.sessions.length&&!isRestType(todayPlan)) key=shiftDateKey(key,-1);
    let count=0;
    for(let i=0;i<365;i++){
      const day=getDay(data,key),plan=planForDate(data,key);
      if(day.workouts.length||day.sessions.length||isRestType(plan)){count++;key=shiftDateKey(key,-1);}else break;
    }
    return count;
  }
  function readiness(entry){
    if(!entry||!Number.isFinite(Number(entry.sleep))) return null;
    const sleep=clamp(entry.sleep,0,16),soreness=clamp(entry.soreness||3,1,5),energy=clamp(entry.energy||3,1,5),stress=clamp(entry.stress||3,1,5);
    let score=100-Math.max(0,8-sleep)*8-(soreness-1)*8-(5-energy)*10-(stress-1)*7; score=clamp(Math.round(score),0,100);
    if(score>=78)return{score,label:'Ready',message:'Normal training looks reasonable. Confirm it during your warm-up.',tone:'success'};
    if(score>=55)return{score,label:'Moderate',message:'Train with extra reps in reserve or trim one or two working sets.',tone:'warning'};
    return{score,label:'Recovery first',message:'Consider rest, active recovery, or a lighter session.',tone:'error'};
  }

  function regionReport(data,endKey=localDateKey()){
    const totals=Object.fromEntries(Object.keys(REGION_META).map(key=>[key,0])); let workingSets=0;
    for(let offset=0;offset<7;offset++){
      const key=shiftDateKey(endKey,-offset); const day=getDay(data,key);
      for(const workout of day.workouts){
        const regions=classifyExercise(workout.name); const sets=getSets(workout).filter(set=>set.done!==false&&set.type!=='warmup');
        workingSets+=sets.length;
        for(const region of regions.primary) totals[region]=(totals[region]||0)+sets.length;
        for(const region of regions.secondary) totals[region]=(totals[region]||0)+sets.length*.5;
      }
    }
    const items=Object.entries(REGION_META).map(([key,[label,group]])=>{const value=round1(totals[key]||0),target=Number(data.regionTargets?.[key]||DEFAULT_TARGETS[key]),ratio=target?value/target:0;return{key,label,group,value,target,ratio,status:ratio<.25?'missed':ratio<.7?'low':ratio<=1.4?'good':'high'};});
    const priorities=items.filter(x=>['missed','low'].includes(x.status)).sort((a,b)=>a.ratio-b.ratio);
    return{items,priorities,workingSets};
  }
  function nutritionTotals(day){ return day.calories.reduce((sum,item)=>({kcal:sum.kcal+(Number(item.kcal)||0),protein:sum.protein+(Number(item.protein)||0),carbs:sum.carbs+(Number(item.carbs)||0),fat:sum.fat+(Number(item.fat)||0)}),{kcal:0,protein:0,carbs:0,fat:0}); }
  function allWorkouts(data){return Object.entries(data.days||{}).flatMap(([date,day])=>(day.workouts||[]).map(workout=>({date,...workout})));}
  function previousWorkout(data,name,beforeKey=localDateKey()){
    const entries=allWorkouts(data).filter(w=>String(w.name).toLowerCase()===String(name).toLowerCase()&&w.date<beforeKey).sort((a,b)=>b.date.localeCompare(a.date)); return entries[0]||null;
  }
  function computePRs(data){
    const best={}; for(const w of allWorkouts(data)){for(const set of getSets(w)){if(set.done===false||set.type==='warmup')continue;const load=Number(set.load)||0,reps=Number(set.reps)||0,estimate=load*(1+reps/30);const key=w.name||'Exercise';if(!best[key]||estimate>best[key].estimate)best[key]={name:key,load,reps,estimate,date:w.date};}}
    return Object.values(best).sort((a,b)=>b.estimate-a.estimate).slice(0,8);
  }

  function makeTheme(mode, highContrast=false){
    const dark=mode==='dark';
    return createTheme({
      palette:{
        mode,
        primary:{main:dark?'#6F8DFF':'#315CD9'},
        secondary:{main:'#FFB547'},
        success:{main:dark?'#43D69E':'#138A61'},
        warning:{main:'#FFB547'},
        error:{main:dark?'#FF7082':'#C9384A'},
        background:{default:dark?'#07111F':'#F5F7FB',paper:dark?'#101C2D':'#FFFFFF'},
        text:{primary:dark?'#F7F9FC':'#142033',secondary:dark?'#9AABC0':'#607087'},
        divider:dark?(highContrast?'rgba(255,255,255,.25)':'rgba(154,171,192,.16)'):(highContrast?'rgba(20,32,51,.25)':'rgba(20,32,51,.10)')
      },
      shape:{borderRadius:16},
      typography:{fontFamily:'Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',h4:{fontWeight:800,letterSpacing:'-.035em'},h5:{fontWeight:800,letterSpacing:'-.025em'},h6:{fontWeight:750,letterSpacing:'-.02em'},button:{fontWeight:750,textTransform:'none'}},
      components:{
        MuiCssBaseline:{styleOverrides:{body:{backgroundImage:dark?'radial-gradient(circle at 50% -10%,#19335a 0,#07111f 32%,#07111f 100%)':'linear-gradient(180deg,#EEF3FC 0,#F7F8FB 34%,#F5F7FB 100%)'}}},
        MuiCard:{styleOverrides:{root:{border:`1px solid ${dark?'rgba(154,171,192,.14)':'rgba(20,32,51,.08)'}`,boxShadow:dark?'0 14px 36px rgba(0,0,0,.18)':'0 12px 32px rgba(36,54,79,.08)',backgroundImage:'none'}}},
        MuiButton:{defaultProps:{disableElevation:true},styleOverrides:{root:{minHeight:44,borderRadius:13}}},
        MuiIconButton:{styleOverrides:{root:{minWidth:44,minHeight:44}}},
        MuiTextField:{defaultProps:{variant:'outlined',size:'small'}},
        MuiOutlinedInput:{styleOverrides:{root:{borderRadius:13}}},
        MuiChip:{styleOverrides:{root:{fontWeight:700}}},
        MuiBottomNavigation:{styleOverrides:{root:{height:'calc(68px + env(safe-area-inset-bottom))',paddingBottom:'env(safe-area-inset-bottom)',backgroundColor:dark?'rgba(7,17,31,.94)':'rgba(255,255,255,.95)',backdropFilter:'blur(18px)',borderTop:`1px solid ${dark?'rgba(154,171,192,.18)':'rgba(20,32,51,.10)'}`}}},
        MuiBottomNavigationAction:{styleOverrides:{root:{minWidth:0,padding:'8px 2px',fontSize:10},label:{fontSize:10,'&.Mui-selected':{fontSize:10}}}},
        MuiDialog:{styleOverrides:{paper:{borderRadius:22}}}
      }
    });
  }

  function CardShell({children,sx={},...props}){return html`<${Card} className="material-card" sx=${{...sx}} ...${props}><${CardContent} sx=${{p:2.1,'&:last-child':{pb:2.1}}}>${children}</${CardContent}></${Card}>`;}
  function PageHeader({eyebrow,title,action}){return html`<${Box} sx=${{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:2,mb:2}}><${Box}><${Typography} variant="overline" color="text.secondary" sx=${{fontWeight:800,letterSpacing:1.2}}>${eyebrow}</${Typography}><${Typography} variant="h4">${title}</${Typography}></${Box}>${action||null}</${Box}>`;}
  function SectionHeading({title,subtitle,action}){return html`<${Box} sx=${{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:1.5,mb:1.2}}><${Box} sx=${{minWidth:0}}><${Typography} variant="h6">${title}</${Typography}>${subtitle?html`<${Typography} variant="body2" color="text.secondary">${subtitle}</${Typography}>`:null}</${Box}>${action||null}</${Box}>`;}
  function InfoButton({term,onOpen}){return html`<${Tooltip} title=${`Explain ${term}`}><${IconButton} size="small" aria-label=${`Explain ${term}`} onClick=${()=>onOpen(term)}><${Icon} name="info" fontSize="small"/></${IconButton}></${Tooltip}>`;}
  function DateBar({value,onChange,label='Editing'}){
    return html`<${Paper} className="date-strip" elevation=${0} sx=${{display:'flex',alignItems:'center',gap:1,p:1,mb:1.5,bgcolor:'background.default',backgroundImage:'none'}}>
      <${IconButton} aria-label="Previous day" onClick=${()=>onChange(shiftDateKey(value,-1))}>‹</${IconButton}>
      <${Button} variant="outlined" startIcon=${html`<${Icon} name="calendar"/>`} sx=${{flex:1,justifyContent:'flex-start',minWidth:0}} component="label">
        <${Box} sx=${{minWidth:0,textAlign:'left'}}><${Typography} component="span" variant="caption" color="text.secondary" sx=${{display:'block',lineHeight:1}}>${label}</${Typography}><${Typography} component="span" variant="body2" fontWeight=${800} sx=${{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>${formatDate(value,{weekday:'long',month:'short',day:'numeric'})}</${Typography}></${Box}>
        <input className="sr-only" type="date" value=${value} max=${localDateKey()} onChange=${e=>e.target.value&&onChange(e.target.value)} />
      </${Button}>
      ${value!==localDateKey()?html`<${Button} size="small" onClick=${()=>onChange(localDateKey())}>Today</${Button}>`:null}
      <${IconButton} aria-label="Next day" disabled=${value>=localDateKey()} onClick=${()=>onChange(shiftDateKey(value,1))}>›</${IconButton}>
    </${Paper}>`;
  }
  function MetricCard({label,value,sub,progress,color='primary'}){return html`<${CardShell} sx=${{height:'100%'}}><${Typography} variant="caption" color="text.secondary" fontWeight=${800}>${label}</${Typography}><${Typography} className="metric-number" variant="h5" sx=${{mt:.3}}>${value}</${Typography}>${sub?html`<${Typography} variant="caption" color="text.secondary">${sub}</${Typography}>`:null}${Number.isFinite(progress)?html`<${LinearProgress} variant="determinate" value=${clamp(progress,0,100)} color=${color} sx=${{mt:1.2,height:7,borderRadius:99}}/>`:null}</${CardShell}>`;}

  function useSetlineState(){
    const [data,setData]=useState(()=>loadState());
    const saveTimer=useRef(null);
    useEffect(()=>{clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>persistState(data),120);return()=>clearTimeout(saveTimer.current);},[data]);
    const update=useCallback(mutator=>setData(prev=>{const next=deepClone(prev);mutator(next);next.schemaVersion=6;next.updatedAt=new Date().toISOString();return next;}),[]);
    return [data,update,setData];
  }

  function useServiceWorker(setUpdateReady){
    useEffect(()=>{
      if(!('serviceWorker' in navigator)) return;
      let registration;
      navigator.serviceWorker.register('./sw.js').then(reg=>{
        registration=reg;
        if(reg.waiting)setUpdateReady(reg);
        reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)setUpdateReady(reg);});});
      }).catch(console.warn);
      const reload=()=>window.location.reload(); navigator.serviceWorker.addEventListener('controllerchange',reload);
      return()=>navigator.serviceWorker.removeEventListener('controllerchange',reload);
    },[setUpdateReady]);
  }

  function setThemeMeta(mode){
    const color=mode==='dark'?'#07111f':'#f5f7fb'; const tag=document.querySelector('meta[name="theme-color"]'); if(tag)tag.setAttribute('content',color);
  }

  function OnboardingDialog({open,data,update,onClose}){
    const fullScreen=useMediaQuery(theme=>theme.breakpoints.down('sm'));
    const [step,setStep]=useState(0);
    const [draft,setDraft]=useState(()=>deepClone(data.profile));
    const [themeMode,setThemeMode]=useState(data.settings.theme||'system');
    useEffect(()=>{if(open){setDraft(deepClone(data.profile));setThemeMode(data.settings.theme||'system');setStep(0);}},[open]);
    const finish=()=>{update(next=>{next.profile={...next.profile,...draft,trainingDays:Number(draft.trainingDays)||4};next.settings.theme=themeMode;next.weeklyPlan=generatePlan(draft.split,Number(draft.trainingDays)||4);next.scheduleMeta.configured=true;next.onboardingComplete=true;});onClose();};
    const steps=['Goal','Training','Preferences'];
    return html`<${Dialog} open=${open} fullScreen=${fullScreen} maxWidth="sm" fullWidth onClose=${onClose}>
      <${DialogTitle}>Set up Setline 6.6</${DialogTitle}>
      <${DialogContent}>
        <${Stepper} activeStep=${step} alternativeLabel sx=${{mb:3}}>${steps.map(label=>html`<${Step} key=${label}><${StepLabel}>${label}</${StepLabel}></${Step}>`)}</${Stepper}>
        ${step===0?html`<${Stack} spacing=${2}><${TextField} label="Your name" value=${draft.name||''} onChange=${e=>setDraft({...draft,name:e.target.value})}/><${TextField} select label="Primary goal" value=${draft.goal||'build_muscle'} onChange=${e=>setDraft({...draft,goal:e.target.value})}><${MenuItem} value="build_muscle">Build muscle</${MenuItem}><${MenuItem} value="strength">Build strength</${MenuItem}><${MenuItem} value="fat_loss">Fat loss</${MenuItem}><${MenuItem} value="general">General fitness</${MenuItem}></${TextField}></${Stack}>`:null}
        ${step===1?html`<${Stack} spacing=${2}><${TextField} select label="Experience" value=${draft.experience||'intermediate'} onChange=${e=>setDraft({...draft,experience:e.target.value})}><${MenuItem} value="beginner">Beginner</${MenuItem}><${MenuItem} value="intermediate">Intermediate</${MenuItem}><${MenuItem} value="advanced">Advanced</${MenuItem}></${TextField}><${TextField} select label="Preferred split" value=${draft.split||'push_pull_legs'} onChange=${e=>setDraft({...draft,split:e.target.value})}><${MenuItem} value="push_pull_legs">Push / Pull / Legs</${MenuItem}><${MenuItem} value="upper_lower">Upper / Lower</${MenuItem}><${MenuItem} value="full_body">Full body</${MenuItem}><${MenuItem} value="custom">Custom</${MenuItem}></${TextField}><${TextField} label="Training days each week" type="number" inputProps=${{min:1,max:7}} value=${draft.trainingDays||4} onChange=${e=>setDraft({...draft,trainingDays:clamp(e.target.value,1,7)})}/></${Stack}>`:null}
        ${step===2?html`<${Stack} spacing=${2}><${TextField} label="Equipment" value=${(draft.equipment||[]).join(', ')} onChange=${e=>setDraft({...draft,equipment:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)})} helperText="Example: commercial gym, dumbbells, cables"/><${TextField} label="Movements to avoid" value=${draft.avoid||''} onChange=${e=>setDraft({...draft,avoid:e.target.value})} multiline minRows=${2}/><${ToggleButtonGroup} exclusive fullWidth value=${themeMode} onChange=${(_,v)=>v&&setThemeMode(v)}><${ToggleButton} value="light">Light</${ToggleButton}><${ToggleButton} value="dark">Dark</${ToggleButton}><${ToggleButton} value="system">System</${ToggleButton}></${ToggleButtonGroup}></${Stack}>`:null}
      </${DialogContent}>
      <${DialogActions}><${Button} onClick=${onClose}>Skip</${Button}>${step>0?html`<${Button} onClick=${()=>setStep(step-1)}>Back</${Button}>`:null}<${Button} variant="contained" onClick=${()=>step<steps.length-1?setStep(step+1):finish()}>${step<steps.length-1?'Next':'Finish setup'}</${Button}></${DialogActions}>
    </${Dialog}>`;
  }
  function generatePlan(split,days){
    const templates={push_pull_legs:['push','pull','legs','rest','push','pull','rest'],upper_lower:['upper','lower','rest','upper','lower','rest','rest'],full_body:['full_body','rest','full_body','rest','full_body','rest','rest'],custom:['workout','rest','workout','rest','workout','rest','rest']};
    const base=[...(templates[split]||templates.push_pull_legs)]; let active=base.filter(x=>!isRestType(x)).length;
    for(let i=6;i>=0&&active>days;i--)if(!isRestType(base[i])){base[i]='rest';active--;}
    for(let i=0;i<7&&active<days;i++)if(isRestType(base[i])){base[i]=split==='full_body'?'full_body':'workout';active++;}
    return base;
  }

  function ensureDayMutable(data,key){
    if(!data.days) data.days={};
    if(!data.days[key]) data.days[key]={workouts:[],calories:[],sessions:[]};
    if(!Array.isArray(data.days[key].workouts)) data.days[key].workouts=[];
    if(!Array.isArray(data.days[key].calories)) data.days[key].calories=[];
    if(!Array.isArray(data.days[key].sessions)) data.days[key].sessions=[];
    return data.days[key];
  }
  function goalLabel(goal){return({build_muscle:'Build muscle',strength:'Build strength',fat_loss:'Fat loss',general:'General fitness'})[goal]||'Build muscle';}
  function planLabel(type){return({push:'Push',pull:'Pull',legs:'Legs',upper:'Upper',lower:'Lower',full_body:'Full body',workout:'Workout',rest:'Rest day',active_recovery:'Active recovery',deload:'Deload'})[type]||String(type||'Rest').replaceAll('_',' ');}
  function statusColor(status){return status==='good'?'success.main':status==='high'?'warning.main':status==='low'?'secondary.main':'error.main';}
  function regionHex(status){return status==='good'?'#43D69E':status==='high'?'#FFB547':status==='low'?'#FFB547':'#FF7082';}
  function weightDisplay(data,kg){if(!Number.isFinite(Number(kg))||Number(kg)<=0)return '—';return data.preferredUnit==='lb'?round1(Number(kg)*2.20462)+' lb':round1(kg)+' kg';}

  function HomePage({data,update,navigate,openGuide,showFeedback}){
    const today=localDateKey(),day=getDay(data,today),totals=nutritionTotals(day),streak=calculateStreak(data),plan=planForDate(data,today),ready=readiness(data.recovery?.[today]),report=regionReport(data,today),priority=report.priorities[0];
    const firstName=(data.profile?.name||'').trim().split(/\s+/)[0];
    const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening';
    const todayWeight=data.bodyWeights?.[today]||data.bodyWeightKg;
    return html`<div className="page-wrap">
      <${Box} sx=${{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,mb:2}}>
        <${Stack} direction="row" spacing=${1.4} alignItems="center" sx=${{minWidth:0}}><${Avatar} src="./setline-s.svg" variant="rounded" sx=${{width:48,height:48,bgcolor:'primary.main'}}/><${Box} sx=${{minWidth:0}}><${Typography} variant="caption" color="text.secondary" fontWeight=${700}>${greeting}${firstName?`, ${firstName}`:''}</${Typography}><${Typography} variant="h4">Setline</${Typography}></${Box}></${Stack}>
        <${Chip} icon=${html`<span className="streak-flame">🔥</span>`} label=${`${streak} day${streak===1?'':'s'}`} color="warning" variant="outlined"/>
      </${Box}>

      <${CardShell} sx=${{mb:2,background:theme=>theme.palette.mode==='dark'?'linear-gradient(135deg,#162a4a,#101c2d)':'linear-gradient(135deg,#e7efff,#ffffff)'}}>
        <${Stack} direction="row" justifyContent="space-between" alignItems="flex-start" spacing=${2}>
          <${Box}><${Typography} variant="overline" color="primary.main" fontWeight=${800}>TODAY'S PLAN</${Typography}><${Typography} variant="h5">${planLabel(plan)}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.5}}>${isRestType(plan)?'Recovery is part of the program. Planned rest keeps your schedule streak intact.':day.workouts.length?`${day.workouts.length} exercise${day.workouts.length===1?'':'s'} logged so far.`:'Previous performance will be prefilled when you add exercises.'}</${Typography}></${Box}>
          <${Avatar} sx=${{bgcolor:isRestType(plan)?'secondary.main':'primary.main',color:'#fff'}}><${Icon} name=${isRestType(plan)?'rest':'workout'}/></${Avatar}>
        </${Stack}>
        <${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1} sx=${{mt:2}}><${Button} variant="contained" startIcon=${html`<${Icon} name=${isRestType(plan)?'rest':'workout'}/>`} onClick=${()=>navigate('workout')}>${isRestType(plan)?'View recovery day':'Open workout'}</${Button}><${Button} variant="outlined" onClick=${()=>navigate('nutrition')}>Log nutrition</${Button}></${Stack}>
      </${CardShell}>

      <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(4,1fr)'},gap:1.3,mb:2}}>
        <${MetricCard} label="CALORIES" value=${Math.round(totals.kcal)} sub=${`${Math.max(0,data.calorieGoal-totals.kcal)} remaining`} progress=${totals.kcal/data.calorieGoal*100} color="secondary"/>
        <${MetricCard} label="PROTEIN" value=${`${Math.round(totals.protein)} g`} sub=${`${Math.max(0,data.proteinGoal-totals.protein)} g remaining`} progress=${totals.protein/data.proteinGoal*100}/>
        <${MetricCard} label="READINESS" value=${ready?ready.score:'—'} sub=${ready?ready.label:'Check in first'} progress=${ready?.score}/>
        <${MetricCard} label="BODYWEIGHT" value=${weightDisplay(data,todayWeight)} sub="Latest entry"/>
      </${Box}>

      <div className="desktop-grid">
        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Weekly focus" subtitle="Explainable muscle-region coverage" action=${html`<${Button} size="small" onClick=${()=>navigate('progress')}>View report</${Button}>`}/>
            ${report.workingSets<4?html`<${Alert} severity="info">Log a few working sets to unlock a useful weekly focus.</${Alert}>`:priority?html`<${Box}><${Stack} direction="row" justifyContent="space-between" alignItems="center"><${Box}><${Typography} variant="h6">Prioritize ${priority.label}</${Typography}><${Typography} variant="body2" color="text.secondary">${priority.value} of ${priority.target} target effective sets in the last 7 days.</${Typography}></${Box}><${Chip} label=${priority.status.toUpperCase()} color=${priority.status==='missed'?'error':'warning'} size="small"/></${Stack}><${Typography} variant="body2" sx=${{mt:1.4}}>Consider ${REGION_SUGGESTIONS[priority.key]?.slice(0,2).join(' or ')} when this region fits your next session.</${Typography}><${Button} size="small" sx=${{mt:1}} startIcon=${html`<${Icon} name="info"/>`} onClick=${()=>openGuide('Working set')}>How coverage is counted</${Button}></${Box}>`:html`<${Alert} severity="success">Your major regions have reasonable coverage. Progress the exercises already working.</${Alert}>`}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Quick actions"/>
            <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(4,1fr)'},gap:1}}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>navigate('workout')}>Exercise</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="nutrition"/>`} onClick=${()=>navigate('nutrition')}>Food</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="progress"/>`} onClick=${()=>navigate('progress')}>Progress</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="book"/>`} onClick=${()=>openGuide()}>Guide</${Button}>
            </${Box}>
          </${CardShell}>
        </${Stack}>

        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Recovery" subtitle=${formatDate(today,{weekday:'long',month:'short',day:'numeric'})}/>
            ${ready?html`<${Box}><${Stack} direction="row" spacing=${2} alignItems="center"><${Box} sx=${{position:'relative',display:'inline-flex'}}><${CircularProgress} variant="determinate" value=${ready.score} size=${72} thickness=${5} color=${ready.tone}/><${Box} sx=${{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><${Typography} fontWeight=${800}>${ready.score}</${Typography}></${Box}></${Box}><${Box}><${Typography} variant="h6">${ready.label}</${Typography}><${Typography} variant="body2" color="text.secondary">${ready.message}</${Typography}></${Box}></${Stack}></${Box}>`:html`<${Alert} severity="info" action=${html`<${Button} color="inherit" size="small" onClick=${()=>navigate('profile')}>Check in</${Button}>`}>Add sleep, soreness, energy and stress to get recovery guidance.</${Alert}>`}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="This week" subtitle="Planned schedule"/>
            <${Stack} spacing=${.8}>${data.weeklyPlan.map((type,index)=>{const key=shiftDateKey(mondayOf(today),index),current=key===today,logged=getDay(data,key).workouts.length>0;return html`<${Stack} key=${key} direction="row" alignItems="center" justifyContent="space-between" sx=${{p:1,borderRadius:2,bgcolor:current?'action.selected':'transparent'}}><${Stack} direction="row" spacing=${1} alignItems="center"><${Avatar} sx=${{width:28,height:28,fontSize:12,bgcolor:logged?'success.main':isRestType(type)?'secondary.main':'primary.main'}}>${logged?'✓':formatDate(key,{weekday:'narrow'})}</${Avatar}><${Typography} variant="body2" fontWeight=${current?800:600}>${formatDate(key,{weekday:'short'})}</${Typography}></${Stack}><${Typography} variant="body2" color="text.secondary">${planLabel(type)}</${Typography}></${Stack}>`;})}</${Stack}>
          </${CardShell}>
        </${Stack}>
      </div>
    </div>`;
  }

  const COMMON_EXERCISES=['Incline Dumbbell Press','Chest Press','Cable Fly','Shoulder Press','Cable Lateral Raise','Rear Delt Fly','Rope Triceps Pushdown','Overhead Triceps Extension','Lat Pulldown','Seated Cable Row','Chest-Supported Row','Face Pull','Preacher Curl','Hammer Curl','Hack Squat','Leg Press','Romanian Deadlift','Leg Curl','Leg Extension','Hip Thrust','Calf Raise','Cable Crunch'];

  function AddExerciseDialog({open,onClose,data,dateKey,onAdd,initial=null}){
    const [name,setName]=useState(''); const [count,setCount]=useState(3); const [load,setLoad]=useState(''); const [reps,setReps]=useState(10); const [group,setGroup]=useState(''); const [usePrevious,setUsePrevious]=useState(true);
    useEffect(()=>{if(open){setName(initial?.name||'');setCount(initial?getSets(initial).length:3);setLoad(initial?getSets(initial)[0]?.load||'':'');setReps(initial?getSets(initial)[0]?.reps||10:10);setGroup(initial?.group||'');setUsePrevious(!initial);}},[open,initial]);
    const previous=name?previousWorkout(data,name,dateKey):null;
    const submit=()=>{if(!name.trim())return;let sets;if(usePrevious&&previous){sets=getSets(previous).map(set=>({...set,id:id('set'),done:false,note:''}));}else{sets=Array.from({length:clamp(count,1,12)},()=>({id:id('set'),load:Number(load)||0,reps:Number(reps)||0,done:false,type:'working',rir:'',rpe:'',note:''}));}onAdd({id:initial?.id||id('workout'),name:name.trim(),group:group.trim(),setEntries:sets,loggedAt:initial?.loggedAt||new Date().toISOString(),updatedAt:new Date().toISOString()},initial);onClose();};
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="sm" fullWidth>
      <${DialogTitle}>${initial?'Edit exercise':'Add exercise'}</${DialogTitle}>
      <${DialogContent}><${Stack} spacing=${2} sx=${{pt:.5}}>
        <${TextField} label="Exercise name" value=${name} onChange=${e=>setName(e.target.value)} autoFocus inputProps=${{list:'exercise-suggestions'}}/><datalist id="exercise-suggestions">${COMMON_EXERCISES.map(x=>html`<option value=${x}></option>`)}</datalist>
        <${Box} sx=${{display:'flex',gap:.7,flexWrap:'wrap'}}>${COMMON_EXERCISES.slice(0,8).map(item=>html`<${Chip} key=${item} label=${item} size="small" variant="outlined" onClick=${()=>setName(item)}/>` )}</${Box}>
        ${previous&&!initial?html`<${Alert} severity="info"><b>Previous:</b> ${getSets(previous).map(s=>`${s.load||0}×${s.reps||0}`).join(', ')}<${FormControlLabel} sx=${{display:'block',mt:.5}} control=${html`<${Checkbox} checked=${usePrevious} onChange=${e=>setUsePrevious(e.target.checked)}/>`} label="Prefill previous sets as incomplete"/></${Alert}>`:null}
        ${!usePrevious||!previous||initial?html`<${Box} sx=${{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1}}><${TextField} label="Sets" type="number" value=${count} onChange=${e=>setCount(e.target.value)} inputProps=${{min:1,max:12}}/><${TextField} label=${`Load (${data.preferredUnit})`} type="number" value=${load} onChange=${e=>setLoad(e.target.value)} inputProps=${{min:0,step:.5}}/><${TextField} label="Reps" type="number" value=${reps} onChange=${e=>setReps(e.target.value)} inputProps=${{min:0,max:100}}/></${Box}>`:null}
        <${TextField} label="Superset group (optional)" value=${group} onChange=${e=>setGroup(e.target.value.toUpperCase().slice(0,2))} helperText="Exercises with the same letter are performed back-to-back."/>
      </${Stack}></${DialogContent}>
      <${DialogActions}><${Button} onClick=${onClose}>Cancel</${Button}><${Button} variant="contained" onClick=${submit}>${initial?'Save changes':'Add exercise'}</${Button}></${DialogActions}>
    </${Dialog}>`;
  }

  function RestTimer({until,onStop}){
    const [remaining,setRemaining]=useState(()=>Math.max(0,Math.ceil((until-Date.now())/1000)));
    useEffect(()=>{const timer=setInterval(()=>{const value=Math.max(0,Math.ceil((until-Date.now())/1000));setRemaining(value);if(!value){clearInterval(timer);try{navigator.vibrate?.(120);}catch(err){}}},250);return()=>clearInterval(timer);},[until]);
    if(remaining<=0)return null;
    const min=Math.floor(remaining/60),sec=String(remaining%60).padStart(2,'0');
    return html`<${Paper} elevation=${8} sx=${{position:'fixed',right:{xs:12,sm:24},bottom:'calc(82px + env(safe-area-inset-bottom))',zIndex:1200,p:1.2,pl:1.8,borderRadius:3,display:'flex',alignItems:'center',gap:1.2}}><${Box}><${Typography} variant="caption" color="text.secondary">REST TIMER</${Typography}><${Typography} className="metric-number" variant="h6">${min}:${sec}</${Typography}></${Box}><${IconButton} size="small" onClick=${onStop}><${Icon} name="close"/></${IconButton}></${Paper}>`;
  }

  function WorkoutPage({data,update,selectedDate,setSelectedDate,openGuide,showFeedback,showCompletion}){
    const day=getDay(data,selectedDate); const plan=planForDate(data,selectedDate); const [addOpen,setAddOpen]=useState(false); const [editIndex,setEditIndex]=useState(null); const [advanced,setAdvanced]=useState({}); const [restUntil,setRestUntil]=useState(0);
    const currentWorkouts=day.workouts;
    const mutateWorkout=(index,fn)=>update(next=>{const target=ensureDayMutable(next,selectedDate).workouts[index];if(target)fn(target);});
    const addExercise=(workout,initial)=>update(next=>{const target=ensureDayMutable(next,selectedDate);if(initial&&editIndex!==null){const existing=target.workouts[editIndex];target.workouts[editIndex]={...existing,...workout,setEntries:existing.setEntries||workout.setEntries};}else target.workouts.push(workout);});
    const updateSet=(wi,si,patch)=>mutateWorkout(wi,workout=>{if(!Array.isArray(workout.setEntries))workout.setEntries=getSets(workout);workout.setEntries[si]={...workout.setEntries[si],...patch};workout.updatedAt=new Date().toISOString();});
    const completeSet=(wi,si,set)=>{const done=set.done===false;updateSet(wi,si,{done});showFeedback(done?'Set saved':'Set reopened');if(done&&data.autoRest)setRestUntil(Date.now()+Number(data.restSeconds||90)*1000);};
    const addSet=(wi)=>mutateWorkout(wi,workout=>{if(!Array.isArray(workout.setEntries))workout.setEntries=getSets(workout);const last=workout.setEntries.at(-1)||{};workout.setEntries.push({...last,id:id('set'),done:false,note:''});});
    const deleteExercise=wi=>{if(!confirm('Delete this exercise from the selected session?'))return;update(next=>ensureDayMutable(next,selectedDate).workouts.splice(wi,1));showFeedback('Exercise removed');};
    const duplicateExercise=wi=>update(next=>{const target=ensureDayMutable(next,selectedDate);const copy=deepClone(target.workouts[wi]);copy.id=id('workout');copy.name=`${copy.name}`;copy.setEntries=getSets(copy).map(s=>({...s,id:id('set'),done:false}));target.workouts.splice(wi+1,0,copy);});
    const completeWorkout=()=>{
      if(!currentWorkouts.length)return;
      const sets=currentWorkouts.flatMap(getSets).filter(s=>s.done!==false&&s.type!=='warmup'); const volume=sets.reduce((sum,s)=>sum+setVolume(s),0); const regions=new Set(currentWorkouts.flatMap(w=>classifyExercise(w.name).primary));
      update(next=>{const target=ensureDayMutable(next,selectedDate);target.sessions.push({id:id('session'),name:`${planLabel(plan)} session`,exerciseCount:currentWorkouts.length,setCount:sets.length,volume,regions:[...regions],completedAt:new Date().toISOString()});});
      showCompletion({name:`${planLabel(plan)} complete`,exerciseCount:currentWorkouts.length,setCount:sets.length,volume,regions:[...regions],streak:calculateStreak(data)});
    };
    const changePlan=type=>update(next=>{next.schedule[selectedDate]=type;next.scheduleMeta.configured=true;});
    return html`<div className="page-wrap">
      <${PageHeader} eyebrow="TRAIN" title="Workout" action=${html`<${Button} variant="contained" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>setAddOpen(true)}>Exercise</${Button}>`}/>
      <${DateBar} value=${selectedDate} onChange=${setSelectedDate} label="Workout date"/>

      <${CardShell} sx=${{mb:2}}><${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1.2} alignItems=${{sm:'center'}} justifyContent="space-between"><${Box}><${Typography} variant="overline" color=${isRestType(plan)?'secondary.main':'primary.main'} fontWeight=${800}>PLANNED SESSION</${Typography}><${Typography} variant="h6">${planLabel(plan)}</${Typography}><${Typography} variant="body2" color="text.secondary">${isRestType(plan)?'No missed-workout warning will be created for this planned recovery day.':'Log working sets; warm-ups are excluded from region coverage.'}</${Typography}></${Box}><${TextField} select size="small" label="Change" value=${plan} onChange=${e=>changePlan(e.target.value)} sx=${{minWidth:155}}><${MenuItem} value="push">Push</${MenuItem}><${MenuItem} value="pull">Pull</${MenuItem}><${MenuItem} value="legs">Legs</${MenuItem}><${MenuItem} value="upper">Upper</${MenuItem}><${MenuItem} value="lower">Lower</${MenuItem}><${MenuItem} value="full_body">Full body</${MenuItem}><${MenuItem} value="rest">Rest day</${MenuItem}><${MenuItem} value="active_recovery">Active recovery</${MenuItem}><${MenuItem} value="deload">Deload</${MenuItem}></${TextField}></${Stack}></${CardShell}>

      ${isRestType(plan)&&!currentWorkouts.length?html`<${Alert} severity="info" icon=${html`<${Icon} name="rest"/>`} sx=${{mb:2}}>${plan==='rest'?'Rest completely or take an easy walk.':plan==='active_recovery'?'Keep movement light enough that it supports recovery.':'Reduce training stress by lowering sets, load, or effort.'}</${Alert}>`:null}

      <${Stack} spacing=${1.5}>
        ${currentWorkouts.length?currentWorkouts.map((workout,wi)=>{
          const sets=Array.isArray(workout.setEntries)?workout.setEntries:getSets(workout); const regions=classifyExercise(workout.name); const isAdvanced=advanced[workout.id||wi]??data.settings.advancedDefault; const previous=previousWorkout(data,workout.name,selectedDate);
          return html`<${CardShell} key=${workout.id||`${workout.name}-${wi}`}>
            <${Stack} direction="row" alignItems="flex-start" justifyContent="space-between" spacing=${1}>
              <${Box} sx=${{minWidth:0}}><${Stack} direction="row" spacing=${.7} alignItems="center" flexWrap="wrap"><${Typography} className="exercise-title" variant="h6">${workout.name}</${Typography}>${workout.group?html`<${Chip} label=${`Group ${workout.group}`} size="small" color="secondary"/>`:null}</${Stack}><${Box} sx=${{display:'flex',gap:.6,flexWrap:'wrap',mt:.7}}>${regions.primary.map(r=>html`<${Chip} key=${r} size="small" label=${REGION_META[r]?.[0]||r} color="primary" variant="outlined"/>`)}${regions.secondary.slice(0,2).map(r=>html`<${Chip} key=${r} size="small" label=${REGION_META[r]?.[0]||r} variant="outlined"/>`)}</${Box}>${previous?html`<${Typography} variant="caption" color="text.secondary" sx=${{display:'block',mt:.8}}>Previous ${formatDate(previous.date)}: ${getSets(previous).map(s=>`${s.load||0}×${s.reps||0}`).join(' · ')}</${Typography}>`:null}</${Box}>
              <${Box} sx=${{display:'flex'}}><${Tooltip} title="Duplicate"><${IconButton} size="small" onClick=${()=>duplicateExercise(wi)}><${Icon} name="copy" fontSize="small"/></${IconButton}></${Tooltip}><${Tooltip} title="Edit"><${IconButton} size="small" onClick=${()=>{setEditIndex(wi);setAddOpen(true);}}><${Icon} name="edit" fontSize="small"/></${IconButton}></${Tooltip}><${Tooltip} title="Delete"><${IconButton} size="small" color="error" onClick=${()=>deleteExercise(wi)}><${Icon} name="delete" fontSize="small"/></${IconButton}></${Tooltip}></${Box}>
            </${Stack}>
            <${Divider} sx=${{my:1.5}}/>
            <div className=${`set-grid ${isAdvanced?'advanced':''} set-head`}><span>Set</span><span>Load</span><span>Reps</span>${isAdvanced?html`<span>RIR / type</span>`:null}<span>Done</span></div>
            <${Stack} spacing=${1} sx=${{mt:.7}}>${sets.map((set,si)=>html`<${Box} key=${set.id||si}>
              <div className=${`set-grid ${isAdvanced?'advanced':''}`}>
                <${Avatar} sx=${{width:30,height:30,fontSize:12,bgcolor:set.done===false?'action.selected':'primary.main',color:set.done===false?'text.secondary':'#fff'}}>${si+1}</${Avatar}>
                <${TextField} className="set-input" aria-label=${`Set ${si+1} load`} type="number" value=${set.load??''} onChange=${e=>updateSet(wi,si,{load:e.target.value})} inputProps=${{min:0,step:.5}} InputProps=${{endAdornment:html`<${InputAdornment} position="end">${data.preferredUnit}</${InputAdornment}>`}}/>
                <${TextField} className="set-input" aria-label=${`Set ${si+1} reps`} type="number" value=${set.reps??''} onChange=${e=>updateSet(wi,si,{reps:e.target.value})} inputProps=${{min:0,max:200}}/>
                ${isAdvanced?html`<${Stack} spacing=${.5}><${TextField} className="set-input" aria-label=${`Set ${si+1} RIR`} type="number" value=${set.rir??''} onChange=${e=>updateSet(wi,si,{rir:e.target.value,rpe:e.target.value===''?'':10-Number(e.target.value)})} placeholder="RIR" inputProps=${{min:0,max:10}}/><${TextField} select value=${set.type||'working'} onChange=${e=>updateSet(wi,si,{type:e.target.value})} SelectProps=${{native:true}}><option value="warmup">Warm-up</option><option value="working">Working</option><option value="amrap">AMRAP</option><option value="drop">Drop</option><option value="failure">Failure</option></${TextField}></${Stack}>`:null}
                <${IconButton} aria-label=${set.done===false?'Complete set':'Reopen set'} color=${set.done===false?'default':'success'} onClick=${()=>completeSet(wi,si,set)} sx=${{border:'1px solid',borderColor:set.done===false?'divider':'success.main'}}><${Icon} name="check"/></${IconButton}>
              </div>
              ${isAdvanced?html`<${TextField} fullWidth multiline maxRows=${2} value=${set.note||''} onChange=${e=>updateSet(wi,si,{note:e.target.value})} placeholder="Set note (optional)" sx=${{mt:.7}}/>`:null}
            </${Box}>`)}</${Stack}>
            <${Stack} direction="row" spacing=${1} flexWrap="wrap" sx=${{mt:1.4}}><${Button} size="small" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>addSet(wi)}>Add set</${Button}><${Button} size="small" onClick=${()=>setAdvanced({...advanced,[workout.id||wi]:!isAdvanced})}>${isAdvanced?'Hide advanced':'Advanced'}</${Button}>${isAdvanced?html`<${InfoButton} term="RIR" onOpen=${openGuide}/><${InfoButton} term="RPE" onOpen=${openGuide}/><${InfoButton} term="AMRAP" onOpen=${openGuide}/><${InfoButton} term="Drop set" onOpen=${openGuide}/>`:null}</${Stack}>
          </${CardShell}>`;
        }):html`<${CardShell}><${Box} sx=${{textAlign:'center',py:4}}><${Avatar} sx=${{mx:'auto',mb:1.5,bgcolor:'primary.main',width:56,height:56}}><${Icon} name=${isRestType(plan)?'rest':'workout'}/></${Avatar}><${Typography} variant="h6">${isRestType(plan)?'Planned recovery day':'No exercises yet'}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.5,mb:2}}>${isRestType(plan)?'You can leave this day empty or log optional light work.':'Add the first exercise. Setline can prefill your previous performance.'}</${Typography}><${Button} variant="contained" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>setAddOpen(true)}>Add exercise</${Button}></${Box}></${CardShell}>`}
      </${Stack}>
      ${currentWorkouts.length?html`<${CardShell} sx=${{mt:2}}><${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1.2} alignItems=${{sm:'center'}} justifyContent="space-between"><${Box}><${Typography} variant="h6">Finish the session</${Typography}><${Typography} variant="body2" color="text.secondary">Completed sets are saved continuously. This creates the final summary and streak moment.</${Typography}></${Box}><${Button} variant="contained" color="success" startIcon=${html`<${Icon} name="check"/>`} onClick=${completeWorkout}>Complete workout</${Button}></${Stack}></${CardShell}>`:null}
      <${AddExerciseDialog} open=${addOpen} onClose=${()=>{setAddOpen(false);setEditIndex(null);}} data=${data} dateKey=${selectedDate} initial=${editIndex===null?null:currentWorkouts[editIndex]} onAdd=${addExercise}/>
      ${restUntil?html`<${RestTimer} until=${restUntil} onStop=${()=>setRestUntil(0)}/>`:null}
    </div>`;
  }

  function AddFoodDialog({open,onClose,data,initial,onSave,defaultMeal='Breakfast'}){
    const blank={name:'',meal:defaultMeal,kcal:'',protein:'',carbs:'',fat:'',amount:1,unit:'serving',favorite:false,barcode:''};
    const [form,setForm]=useState(blank); const [query,setQuery]=useState(''); const [results,setResults]=useState([]); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
    useEffect(()=>{if(open){setForm(initial?{...blank,...initial,favorite:data.favoriteFoods.some(f=>String(f.name).toLowerCase()===String(initial.name).toLowerCase())}:blank);setQuery('');setResults([]);setError('');}},[open,initial,defaultMeal]);
    const patch=(key,value)=>setForm({...form,[key]:value});
    const applyProduct=product=>{const n=product.nutriments||{};setForm({...form,name:product.product_name||product.generic_name||form.name,kcal:Math.round(Number(n['energy-kcal_100g']||0)),protein:round1(n.proteins_100g||0),carbs:round1(n.carbohydrates_100g||0),fat:round1(n.fat_100g||0),amount:100,unit:'g',barcode:product.code||form.barcode});setResults([]);};
    const search=async()=>{if(!query.trim())return;setLoading(true);setError('');try{const url=`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8`;const res=await fetch(url);if(!res.ok)throw new Error('Search failed');const json=await res.json();setResults((json.products||[]).filter(p=>p.product_name&&p.nutriments).slice(0,8));if(!(json.products||[]).length)setError('No products found. Enter the nutrition manually.');}catch(err){setError('Food search is unavailable right now. Manual logging still works.');}finally{setLoading(false);}};
    const lookupBarcode=async(code=form.barcode)=>{if(!code.trim())return;setLoading(true);setError('');try{const res=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code.trim())}.json`);const json=await res.json();if(!json.product)throw new Error('Not found');applyProduct({...json.product,code});}catch(err){setError('Barcode not found. Enter the food manually.');}finally{setLoading(false);}};
    const scanImage=async file=>{if(!file)return;if(!('BarcodeDetector' in window)){setError('Camera barcode detection is not supported in this browser. Type the barcode instead.');return;}setLoading(true);try{const bitmap=await createImageBitmap(file);const detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});const codes=await detector.detect(bitmap);if(!codes.length)throw new Error('No barcode');patch('barcode',codes[0].rawValue);await lookupBarcode(codes[0].rawValue);}catch(err){setError('No barcode was detected in that image.');}finally{setLoading(false);}};
    const submit=()=>{if(!form.name.trim()||!Number.isFinite(Number(form.kcal))){setError('Enter a food name and calories.');return;}onSave({...form,id:initial?.id||id('food'),name:form.name.trim(),kcal:Number(form.kcal)||0,protein:Number(form.protein)||0,carbs:Number(form.carbs)||0,fat:Number(form.fat)||0,amount:Number(form.amount)||1,loggedAt:initial?.loggedAt||new Date().toISOString(),updatedAt:new Date().toISOString()});onClose();};
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="sm" fullWidth>
      <${DialogTitle}>${initial?'Edit food':'Log food'}</${DialogTitle}>
      <${DialogContent}><${Stack} spacing=${2} sx=${{pt:.5}}>
        <${Box} sx=${{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:1}}><${TextField} label="Search packaged foods" value=${query} onChange=${e=>setQuery(e.target.value)} onKeyDown=${e=>e.key==='Enter'&&search()} InputProps=${{startAdornment:html`<${InputAdornment} position="start"><${Icon} name="search"/></${InputAdornment}>`}}/><${Button} variant="outlined" onClick=${search} disabled=${loading}>Search</${Button}></${Box}>
        ${loading?html`<${LinearProgress}/>`:null}${error?html`<${Alert} severity="info">${error}</${Alert}>`:null}
        ${results.length?html`<${Paper} variant="outlined" sx=${{maxHeight:230,overflow:'auto'}}>${results.map((p,index)=>html`<${ListItemButton} key=${p.code||index} onClick=${()=>applyProduct(p)}><${ListItemText} primary=${p.product_name} secondary=${`${p.brands||'Unbranded'} · ${Math.round(Number(p.nutriments?.['energy-kcal_100g']||0))} kcal/100g`}/></${ListItemButton}>`)}</${Paper}>`:null}
        <${Divider}>OR ENTER MANUALLY</${Divider}>
        <${TextField} label="Food or meal" value=${form.name} onChange=${e=>patch('name',e.target.value)}/>
        <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(4,1fr)'},gap:1}}><${TextField} label="Calories" type="number" value=${form.kcal} onChange=${e=>patch('kcal',e.target.value)}/><${TextField} label="Protein (g)" type="number" value=${form.protein} onChange=${e=>patch('protein',e.target.value)}/><${TextField} label="Carbs (g)" type="number" value=${form.carbs} onChange=${e=>patch('carbs',e.target.value)}/><${TextField} label="Fat (g)" type="number" value=${form.fat} onChange=${e=>patch('fat',e.target.value)}/></${Box}>
        <${Box} sx=${{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1}}><${TextField} label="Amount" type="number" value=${form.amount} onChange=${e=>patch('amount',e.target.value)}/><${TextField} select label="Unit" value=${form.unit} onChange=${e=>patch('unit',e.target.value)}><${MenuItem} value="serving">Serving</${MenuItem}><${MenuItem} value="g">Grams</${MenuItem}><${MenuItem} value="cup">Cup</${MenuItem}><${MenuItem} value="piece">Piece</${MenuItem}><${MenuItem} value="scoop">Scoop</${MenuItem}><${MenuItem} value="can">Can</${MenuItem}></${TextField}><${TextField} select label="Meal" value=${form.meal} onChange=${e=>patch('meal',e.target.value)}><${MenuItem} value="Breakfast">Breakfast</${MenuItem}><${MenuItem} value="Lunch">Lunch</${MenuItem}><${MenuItem} value="Dinner">Dinner</${MenuItem}><${MenuItem} value="Snack">Snack</${MenuItem}></${TextField}></${Box}>
        <${Box} sx=${{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto auto',gap:1}}><${TextField} label="Barcode" value=${form.barcode} onChange=${e=>patch('barcode',e.target.value)}/><${Button} variant="outlined" onClick=${()=>lookupBarcode()}>Lookup</${Button}><${Button} variant="outlined" component="label">Scan<input className="sr-only" type="file" accept="image/*" capture="environment" onChange=${e=>scanImage(e.target.files?.[0])}/></${Button}></${Box}>
        <${FormControlLabel} control=${html`<${Checkbox} checked=${!!form.favorite} onChange=${e=>patch('favorite',e.target.checked)}/>`} label="Save to favourites"/>
      </${Stack}></${DialogContent}>
      <${DialogActions}><${Button} onClick=${onClose}>Cancel</${Button}><${Button} variant="contained" color="secondary" onClick=${submit}>Save food</${Button}></${DialogActions}>
    </${Dialog}>`;
  }

  function NutritionPage({data,update,selectedDate,setSelectedDate,showFeedback}){
    const day=getDay(data,selectedDate),totals=nutritionTotals(day); const [dialogOpen,setDialogOpen]=useState(false); const [editItem,setEditItem]=useState(null); const [defaultMeal,setDefaultMeal]=useState('Breakfast');
    const saveFood=item=>update(next=>{const target=ensureDayMutable(next,selectedDate);const index=editItem?target.calories.findIndex(x=>x.id===editItem.id):-1;if(index>=0)target.calories[index]=item;else target.calories.push(item);next.recentFoods=[item,...(next.recentFoods||[]).filter(x=>String(x.name).toLowerCase()!==item.name.toLowerCase())].slice(0,12);if(item.favorite){next.favoriteFoods=[item,...(next.favoriteFoods||[]).filter(x=>String(x.name).toLowerCase()!==item.name.toLowerCase())].slice(0,30);}else next.favoriteFoods=(next.favoriteFoods||[]).filter(x=>String(x.name).toLowerCase()!==item.name.toLowerCase());showFeedback(editItem?'Food updated':'Food logged');});
    const removeFood=item=>{if(!confirm(`Delete ${item.name}?`))return;update(next=>{const target=ensureDayMutable(next,selectedDate);target.calories=target.calories.filter(x=>x.id!==item.id);});showFeedback('Food removed');};
    const quickLog=item=>{setEditItem({...item,id:null,loggedAt:null});setDefaultMeal(item.meal||'Snack');setDialogOpen(true);};
    const copyYesterday=()=>{const previous=getDay(data,shiftDateKey(selectedDate,-1)).calories;if(!previous.length){showFeedback('No food found yesterday');return;}update(next=>{const target=ensureDayMutable(next,selectedDate);target.calories.push(...previous.map(item=>({...deepClone(item),id:id('food'),loggedAt:new Date().toISOString()})));});showFeedback('Yesterday copied');};
    const saveDayTemplate=()=>{if(!day.calories.length)return;const name=prompt('Name this saved meal or day template:','My day');if(!name)return;update(next=>next.savedMeals.unshift({id:id('meal'),name,items:deepClone(day.calories),createdAt:new Date().toISOString()}));showFeedback('Template saved');};
    const applyTemplate=template=>{update(next=>{const target=ensureDayMutable(next,selectedDate);target.calories.push(...template.items.map(item=>({...deepClone(item),id:id('food'),loggedAt:new Date().toISOString()})));});showFeedback(`${template.name} added`);};
    const meals=['Breakfast','Lunch','Dinner','Snack'];
    const weekly=Array.from({length:7},(_,i)=>nutritionTotals(getDay(data,shiftDateKey(selectedDate,-i)))); const average=weekly.reduce((sum,x)=>({kcal:sum.kcal+x.kcal,protein:sum.protein+x.protein,carbs:sum.carbs+x.carbs,fat:sum.fat+x.fat}),{kcal:0,protein:0,carbs:0,fat:0});Object.keys(average).forEach(k=>average[k]=round1(average[k]/7));
    return html`<div className="page-wrap">
      <${PageHeader} eyebrow="FUEL" title="Nutrition" action=${html`<${Button} variant="contained" color="secondary" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>{setEditItem(null);setDefaultMeal('Breakfast');setDialogOpen(true);}}>Food</${Button}>`}/>
      <${DateBar} value=${selectedDate} onChange=${setSelectedDate} label="Nutrition date"/>
      <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(4,1fr)'},gap:1.2,mb:2}}><${MetricCard} label="CALORIES" value=${Math.round(totals.kcal)} sub=${`${data.calorieGoal} target`} progress=${totals.kcal/data.calorieGoal*100} color="secondary"/><${MetricCard} label="PROTEIN" value=${`${Math.round(totals.protein)} g`} sub=${`${Math.max(0,Math.round(data.proteinGoal-totals.protein))} g remaining`} progress=${totals.protein/data.proteinGoal*100}/><${MetricCard} label="CARBS" value=${`${Math.round(totals.carbs)} g`} sub=${`${data.carbsGoal} g target`} progress=${totals.carbs/data.carbsGoal*100}/><${MetricCard} label="FAT" value=${`${Math.round(totals.fat)} g`} sub=${`${data.fatGoal} g target`} progress=${totals.fat/data.fatGoal*100}/></${Box}>

      <div className="desktop-grid">
        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Fast log" subtitle="Favourites, recent foods and templates"/>
            ${(data.favoriteFoods||[]).length?html`<${Typography} variant="caption" color="text.secondary" fontWeight=${800}>FAVOURITES</${Typography}><${Box} sx=${{display:'flex',gap:.7,flexWrap:'wrap',mt:.7,mb:1.4}}>${data.favoriteFoods.slice(0,8).map(item=>html`<${Chip} key=${item.name} label=${item.name} color="secondary" variant="outlined" onClick=${()=>quickLog(item)}/>` )}</${Box}>`:null}
            ${(data.recentFoods||[]).length?html`<${Typography} variant="caption" color="text.secondary" fontWeight=${800}>RECENT</${Typography}><${Box} sx=${{display:'flex',gap:.7,flexWrap:'wrap',mt:.7}}>${data.recentFoods.slice(0,8).map(item=>html`<${Chip} key=${item.name} label=${item.name} variant="outlined" onClick=${()=>quickLog(item)}/>` )}</${Box}>`:html`<${Typography} variant="body2" color="text.secondary">Your recent and favourite foods will appear here.</${Typography}>`}
            <${Stack} direction="row" spacing=${1} flexWrap="wrap" sx=${{mt:1.5}}><${Button} size="small" startIcon=${html`<${Icon} name="copy"/>`} onClick=${copyYesterday}>Copy yesterday</${Button}><${Button} size="small" disabled=${!day.calories.length} onClick=${saveDayTemplate}>Save today as template</${Button}></${Stack}>
            ${(data.savedMeals||[]).length?html`<${Divider} sx=${{my:1.5}}/><${Box} sx=${{display:'flex',gap:.7,flexWrap:'wrap'}}>${data.savedMeals.slice(0,6).map(template=>html`<${Chip} key=${template.id} label=${template.name} onClick=${()=>applyTemplate(template)} onDelete=${()=>update(next=>next.savedMeals=next.savedMeals.filter(x=>x.id!==template.id))}/>` )}</${Box}>`:null}
          </${CardShell}>

          ${meals.map(meal=>{const entries=day.calories.filter(item=>(item.meal||'Snack')===meal),mealTotals=nutritionTotals({calories:entries});return html`<${CardShell} key=${meal}>
            <${SectionHeading} title=${meal} subtitle=${entries.length?`${Math.round(mealTotals.kcal)} kcal · ${Math.round(mealTotals.protein)} g protein`:'Nothing logged'} action=${html`<${IconButton} color="secondary" aria-label=${`Add ${meal}`} onClick=${()=>{setEditItem(null);setDefaultMeal(meal);setDialogOpen(true);}}><${Icon} name="add"/></${IconButton}>`}/>
            ${entries.length?html`<${Stack} spacing=${1}>${entries.map(item=>html`<${Paper} key=${item.id} variant="outlined" sx=${{p:1.3,borderRadius:3}}><div className="food-row"><div><${Typography} className="food-name" fontWeight=${750}>${item.name}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.amount||1} ${item.unit||'serving'} · P ${round1(item.protein||0)} · C ${round1(item.carbs||0)} · F ${round1(item.fat||0)}</${Typography}></div><${Typography} className="food-kcal" fontWeight=${800} color="secondary.main">${Math.round(item.kcal||0)} kcal</${Typography}><div className="food-actions"><${IconButton} size="small" onClick=${()=>{setEditItem(item);setDefaultMeal(meal);setDialogOpen(true);}}><${Icon} name="edit" fontSize="small"/></${IconButton}><${IconButton} size="small" color="error" onClick=${()=>removeFood(item)}><${Icon} name="delete" fontSize="small"/></${IconButton}></div></div></${Paper}>`)}</${Stack}>`:html`<${Button} fullWidth variant="outlined" color="secondary" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>{setEditItem(null);setDefaultMeal(meal);setDialogOpen(true);}}>Add ${meal.toLowerCase()}</${Button}>`}
          </${CardShell}>`;})}
        </${Stack}>

        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Seven-day average" subtitle="Smooths out individual high and low days"/>
            <${Stack} spacing=${1.2}>${[['Calories',average.kcal,data.calorieGoal,'kcal'],['Protein',average.protein,data.proteinGoal,'g'],['Carbs',average.carbs,data.carbsGoal,'g'],['Fat',average.fat,data.fatGoal,'g']].map(([label,value,target,unit])=>html`<${Box} key=${label}><${Stack} direction="row" justifyContent="space-between"><${Typography} variant="body2" fontWeight=${700}>${label}</${Typography}><${Typography} variant="body2" color="text.secondary">${Math.round(value)} / ${target} ${unit}</${Typography}></${Stack}><${LinearProgress} variant="determinate" value=${clamp(value/target*100,0,100)} color=${label==='Calories'?'secondary':'primary'} sx=${{height:7,borderRadius:99,mt:.5}}/></${Box}>`)}</${Stack}>
          </${CardShell}>
          <${CardShell}>
            <${SectionHeading} title="Today at a glance"/>
            <${Typography} variant="body2" color="text.secondary">${totals.protein>=data.proteinGoal?'Protein target reached.':`${Math.max(0,Math.round(data.proteinGoal-totals.protein))} g protein remains.`} ${totals.kcal>data.calorieGoal?`You are ${Math.round(totals.kcal-data.calorieGoal)} kcal over the target.`:`${Math.max(0,Math.round(data.calorieGoal-totals.kcal))} kcal remains.`}</${Typography}>
          </${CardShell}>
        </${Stack}>
      </div>
      <${AddFoodDialog} open=${dialogOpen} onClose=${()=>{setDialogOpen(false);setEditItem(null);}} data=${data} initial=${editItem} defaultMeal=${defaultMeal} onSave=${saveFood}/>
    </div>`;
  }

  function SimpleLineChart({values,labels,color='primary.main',unit=''}){
    const width=600,height=170,pad=18; const numeric=values.map(v=>Number(v)||0); const max=Math.max(...numeric,1),min=Math.min(...numeric,0); const range=Math.max(1,max-min); const points=numeric.map((value,index)=>{const x=pad+(width-pad*2)*(numeric.length<=1?0:index/(numeric.length-1));const y=height-pad-(height-pad*2)*((value-min)/range);return{x,y,value};}); const path=points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
    return html`<${Box} sx=${{color}}><svg className="chart-svg" viewBox=${`0 0 ${width} ${height}`} role="img" aria-label="Progress chart"><line className="chart-grid" x1=${pad} y1=${height-pad} x2=${width-pad} y2=${height-pad}></line><line className="chart-grid" x1=${pad} y1=${pad} x2=${width-pad} y2=${pad}></line>${points.length>1?html`<path className="chart-line" d=${path}></path>`:null}${points.map((p,i)=>html`<g key=${i}><circle className="chart-dot" cx=${p.x} cy=${p.y} r="4"></circle><text x=${p.x} y=${Math.max(12,p.y-10)} text-anchor="middle" fill="currentColor" font-size="11" font-weight="700">${round1(p.value)}${unit}</text><text x=${p.x} y=${height-2} text-anchor="middle" fill="currentColor" opacity=".65" font-size="9">${labels[i]||''}</text></g>`)}</svg></${Box}>`;
  }

  function ProgressPage({data,update,selectedDate,setSelectedDate,showFeedback}){
    const [period,setPeriod]=useState(7); const report=regionReport(data,selectedDate); const prs=computePRs(data);
    const dates=Array.from({length:period},(_,i)=>shiftDateKey(selectedDate,-(period-1-i)));
    const volumeValues=dates.map(key=>getDay(data,key).workouts.reduce((sum,w)=>sum+getSets(w).reduce((a,s)=>a+setVolume(s),0),0));
    const weightEntries=Object.entries(data.bodyWeights||{}).filter(([key])=>key<=selectedDate).sort(([a],[b])=>a.localeCompare(b)).slice(-Math.max(7,period));
    const addWeight=()=>{const raw=prompt(`Bodyweight in ${data.preferredUnit}:`,data.preferredUnit==='kg'?String(data.bodyWeights?.[selectedDate]||data.bodyWeightKg||''):String(round1((data.bodyWeights?.[selectedDate]||data.bodyWeightKg||0)*2.20462)));if(raw===null)return;let value=Number(raw);if(!Number.isFinite(value)||value<=0)return;if(data.preferredUnit==='lb')value=value/2.20462;update(next=>{next.bodyWeights[selectedDate]=round1(value);next.bodyWeightKg=round1(value);});showFeedback('Bodyweight saved');};
    const actionItems=report.priorities.slice(0,3);
    const calendarDates=Array.from({length:28},(_,i)=>shiftDateKey(selectedDate,-(27-i)));
    return html`<div className="page-wrap">
      <${PageHeader} eyebrow="REVIEW" title="Progress" action=${html`<${ToggleButtonGroup} size="small" exclusive value=${period} onChange=${(_,v)=>v&&setPeriod(v)}><${ToggleButton} value=${7}>7D</${ToggleButton}><${ToggleButton} value=${30}>30D</${ToggleButton}></${ToggleButtonGroup}>`}/>
      <${DateBar} value=${selectedDate} onChange=${setSelectedDate} label="Report ending"/>
      <div className="desktop-grid">
        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Weekly coaching report" subtitle="Primary sets count 1.0; secondary sets count 0.5"/>
            ${report.workingSets<4?html`<${Alert} severity="info">More workout data is needed before Setline can make a useful recommendation.</${Alert}>`:actionItems.length?html`<${Alert} severity="warning"><b>Next-week focus:</b> ${actionItems.map(x=>x.label).join(', ')}. Suggestions are based on your logged working sets, not a diagnosis or guarantee of growth.</${Alert}>`:html`<${Alert} severity="success">Coverage looks reasonably balanced. Keep progressing the exercises already producing results.</${Alert}>`}
            <${Stack} spacing=${1.2} sx=${{mt:1.8}}>${report.items.map(item=>html`<${Box} key=${item.key}><${Stack} direction="row" justifyContent="space-between" alignItems="baseline"><${Box}><${Typography} variant="body2" fontWeight=${750}>${item.label}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.group}</${Typography}></${Box}><${Typography} variant="body2" fontWeight=${800} color=${statusColor(item.status)}>${item.value} / ${item.target}</${Typography}></${Stack}><div className="region-bar"><span style=${{width:String(clamp(item.ratio*100,0,100))+'%',backgroundColor:regionHex(item.status)}}></span></div></${Box}>`)}</${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Training volume" subtitle=${String(period)+'-day load × reps'} />
            <${SimpleLineChart} values=${volumeValues} labels=${dates.map(key=>formatDate(key,{month:'numeric',day:'numeric'}))} unit=""/>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Consistency" subtitle="Workout days during the last four weeks"/>
            <div className="calendar-grid">${calendarDates.map(key=>{const active=getDay(data,key).workouts.length>0;return html`<div key=${key} className=${`calendar-day ${active?'active':''} ${key===localDateKey()?'today':''}`} title=${`${formatDate(key)}${active?' · workout logged':''}`}>${formatDate(key,{day:'numeric'})}</div>`;})}</div>
          </${CardShell}>
        </${Stack}>

        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Bodyweight" subtitle="Stored privately on this device" action=${html`<${Button} size="small" startIcon=${html`<${Icon} name="add"/>`} onClick=${addWeight}>Add</${Button}>`}/>
            ${weightEntries.length?html`<${SimpleLineChart} values=${weightEntries.map(([,v])=>data.preferredUnit==='lb'?round1(Number(v)*2.20462):Number(v))} labels=${weightEntries.map(([key])=>formatDate(key,{month:'numeric',day:'numeric'}))} color="secondary.main" unit=${data.preferredUnit}/>`:html`<${Alert} severity="info">Add your first bodyweight entry to start this chart.</${Alert}>`}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Personal records" subtitle="Estimated from your best load and reps"/>
            ${prs.length?html`<${Stack} divider=${html`<${Divider} flexItem/>`}>${prs.map(pr=>html`<${Box} key=${pr.name} sx=${{py:1,display:'flex',justifyContent:'space-between',gap:2}}><${Box} sx=${{minWidth:0}}><${Typography} className="exercise-title" fontWeight=${750}>${pr.name}</${Typography}><${Typography} variant="caption" color="text.secondary">${formatDate(pr.date)} · ${pr.load} ${data.preferredUnit} × ${pr.reps}</${Typography}></${Box}><${Chip} label=${`${Math.round(pr.estimate)} est.`} color="primary" variant="outlined"/></${Box}>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">Complete weighted sets to populate personal records.</${Typography}>`}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Action plan" subtitle="Based on the last seven days"/>
            ${actionItems.length?html`<${Stack} spacing=${1}>${actionItems.map((item,index)=>html`<${Paper} key=${item.key} variant="outlined" sx=${{p:1.3,borderRadius:3}}><${Typography} variant="caption" color="text.secondary" fontWeight=${800}>PRIORITY ${index+1}</${Typography}><${Typography} fontWeight=${800}>${item.label}</${Typography}><${Typography} variant="body2" color="text.secondary">${item.value} of ${item.target} target sets. Consider ${REGION_SUGGESTIONS[item.key]?.slice(0,2).join(' or ')}.</${Typography}></${Paper}>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">No major low-coverage region is currently flagged.</${Typography}>`}
          </${CardShell}>
        </${Stack}>
      </div>
    </div>`;
  }

  function TrainingGuideDialog({open,onClose,initialTerm=''}){
    const [query,setQuery]=useState('');
    useEffect(()=>{if(open)setQuery(initialTerm||'');},[open,initialTerm]);
    const filtered=GUIDE_ITEMS.filter(item=>`${item.term} ${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="md" fullWidth scroll="paper">
      <${DialogTitle} sx=${{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span>Training Guide</span><${IconButton} onClick=${onClose}><${Icon} name="close"/></${IconButton}></${DialogTitle}>
      <${DialogContent} dividers><${TextField} fullWidth placeholder="Search RIR, RPE, AMRAP, drop set…" value=${query} onChange=${e=>setQuery(e.target.value)} InputProps=${{startAdornment:html`<${InputAdornment} position="start"><${Icon} name="search"/></${InputAdornment}>`}} sx=${{mb:2}}/>
        ${filtered.length?filtered.map(item=>html`<${Accordion} key=${item.term} defaultExpanded=${query&&(`${item.term} ${item.title}`.toLowerCase().includes(query.toLowerCase()))} disableGutters><${AccordionSummary} expandIcon=${html`<${Icon} name="chevron"/>`}><${Box}><${Typography} fontWeight=${800}>${item.term}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.title}</${Typography}></${Box}></${AccordionSummary}><${AccordionDetails}><${Typography} className="guide-copy" variant="body2">${item.summary}</${Typography}><${Typography} className="guide-example" variant="body2" color="primary.main"><b>Example:</b> ${item.example}</${Typography}></${AccordionDetails}></${Accordion}>`):html`<${Alert} severity="info">No guide entry matches that search.</${Alert}>`}
      </${DialogContent}>
      <${DialogActions}><${Button} onClick=${onClose}>Close</${Button}></${DialogActions}>
    </${Dialog}>`;
  }

  function ChangelogDialog({open,onClose}){
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="sm" fullWidth scroll="paper"><${DialogTitle} sx=${{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span>What’s New</span><${IconButton} onClick=${onClose}><${Icon} name="close"/></${IconButton}></${DialogTitle}><${DialogContent} dividers><${Stack} spacing=${2}>${CHANGELOG.map((release,index)=>html`<${CardShell} key=${release.version} sx=${{borderColor:index===0?'primary.main':'divider'}}><${Stack} direction="row" justifyContent="space-between" alignItems="center"><${Typography} variant="h6">Setline ${release.version}</${Typography}>${index===0?html`<${Chip} label="CURRENT" color="primary" size="small"/>`:null}</${Stack}><${Typography} variant="caption" color="text.secondary">${release.date}</${Typography}><${List} dense disablePadding sx=${{mt:1}}>${release.items.map(item=>html`<${Box} component="li" key=${item} sx=${{display:'flex',gap:1,py:.45,listStyle:'none'}}><${Icon} name="check" color="success" fontSize="small"/><${Typography} variant="body2">${item}</${Typography}></${Box}>`)}</${List}></${CardShell}>`)}</${Stack}></${DialogContent}><${DialogActions}><${Button} onClick=${onClose}>Close</${Button}></${DialogActions}></${Dialog}>`;
  }

  function ProfilePage({data,update,openGuide,openChangelog,showFeedback,openOnboarding,updateReady,applyUpdate}){
    const [profile,setProfile]=useState(()=>deepClone(data.profile)); const [recoveryDate,setRecoveryDate]=useState(localDateKey()); const recoveryEntry=data.recovery?.[recoveryDate]||{sleep:'',soreness:3,energy:3,stress:3,note:''}; const [recoveryDraft,setRecoveryDraft]=useState(recoveryEntry);
    useEffect(()=>setProfile(deepClone(data.profile)),[data.profile]); useEffect(()=>setRecoveryDraft(data.recovery?.[recoveryDate]||{sleep:'',soreness:3,energy:3,stress:3,note:''}),[recoveryDate,data.recovery]);
    const saveProfile=()=>{update(next=>next.profile={...next.profile,...profile,trainingDays:clamp(profile.trainingDays,1,7)});showFeedback('Profile saved');};
    const saveRecovery=()=>{if(!Number.isFinite(Number(recoveryDraft.sleep))||Number(recoveryDraft.sleep)<0||Number(recoveryDraft.sleep)>16){showFeedback('Enter sleep from 0 to 16 hours');return;}update(next=>next.recovery[recoveryDate]={...recoveryDraft,sleep:round1(recoveryDraft.sleep),soreness:Number(recoveryDraft.soreness),energy:Number(recoveryDraft.energy),stress:Number(recoveryDraft.stress),updatedAt:new Date().toISOString()});showFeedback('Recovery saved');};
    const exportData=()=>{const payload={app:'Setline',version:APP_VERSION,exportedAt:new Date().toISOString(),data};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`setline-backup-${localDateKey()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showFeedback('Backup exported');};
    const importData=async file=>{if(!file)return;try{const parsed=JSON.parse(await file.text());const incoming=normaliseState(parsed.data||parsed);update(next=>Object.assign(next,mergeStates(next,incoming)));showFeedback('Backup merged');}catch(err){showFeedback('Backup could not be read');}};
    const restoreBackup=()=>{const backup=parseCandidate(localStorage.getItem(BACKUP_KEY));if(!backup){showFeedback('No recovery backup found');return;}if(!confirm('Merge the last automatic backup into current data?'))return;update(next=>Object.assign(next,mergeStates(next,backup)));showFeedback('Backup restored');};
    const integrity=()=>{const issues=[];if(!data.days||typeof data.days!=='object')issues.push('Days container missing');for(const [key,day] of Object.entries(data.days||{})){if(!Array.isArray(day.workouts))issues.push(`${key}: workouts invalid`);if(!Array.isArray(day.calories))issues.push(`${key}: nutrition invalid`);}showFeedback(issues.length?`${issues.length} issue${issues.length===1?'':'s'} found`:`Data check passed · ${recordCount(data)} records`);};
    const savePlan=(index,value)=>update(next=>{next.weeklyPlan[index]=value;next.scheduleMeta.configured=true;});
    const habit=data.privateHabit||{}; const habitDays=habit.enabled&&habit.startDate?Math.max(0,Math.floor((dateFromKey(localDateKey())-dateFromKey(habit.startDate))/86400000)+1):0;
    const resetHabit=()=>{if(!confirm('Reset this private habit counter today?'))return;update(next=>{next.privateHabit.personalBest=Math.max(Number(next.privateHabit.personalBest)||0,habitDays);next.privateHabit.startDate=localDateKey();});showFeedback('Counter reset');};
    const weekdays=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return html`<div className="page-wrap">
      <${PageHeader} eyebrow="YOU" title="Profile" action=${html`<${Chip} label=${`v${APP_VERSION}`} variant="outlined"/>`}/>
      ${updateReady?html`<${Alert} severity="info" action=${html`<${Button} color="inherit" size="small" onClick=${applyUpdate}>Update now</${Button}>`} sx=${{mb:2}}>A new Setline version is ready. Your current data will remain in the permanent storage key.</${Alert}>`:null}
      <div className="desktop-grid">
        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Your profile" subtitle=${goalLabel(data.profile.goal)+' · '+data.profile.experience} action=${html`<${Button} size="small" onClick=${openOnboarding}>Run setup</${Button}>`}/>
            <${Stack} spacing=${1.5}><${TextField} label="Name" value=${profile.name||''} onChange=${e=>setProfile({...profile,name:e.target.value})}/><${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:1}}><${TextField} select label="Goal" value=${profile.goal||'build_muscle'} onChange=${e=>setProfile({...profile,goal:e.target.value})}><${MenuItem} value="build_muscle">Build muscle</${MenuItem}><${MenuItem} value="strength">Build strength</${MenuItem}><${MenuItem} value="fat_loss">Fat loss</${MenuItem}><${MenuItem} value="general">General fitness</${MenuItem}></${TextField}><${TextField} select label="Experience" value=${profile.experience||'intermediate'} onChange=${e=>setProfile({...profile,experience:e.target.value})}><${MenuItem} value="beginner">Beginner</${MenuItem}><${MenuItem} value="intermediate">Intermediate</${MenuItem}><${MenuItem} value="advanced">Advanced</${MenuItem}></${TextField}></${Box}><${TextField} label="Equipment" value=${(profile.equipment||[]).join(', ')} onChange=${e=>setProfile({...profile,equipment:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)})}/><${TextField} label="Movements to avoid" value=${profile.avoid||''} onChange=${e=>setProfile({...profile,avoid:e.target.value})}/><${Button} variant="contained" onClick=${saveProfile}>Save profile</${Button}></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Appearance" subtitle="Light, dark or phone setting"/>
            <${ToggleButtonGroup} exclusive fullWidth value=${data.settings.theme||'system'} onChange=${(_,value)=>value&&update(next=>next.settings.theme=value)}><${ToggleButton} value="light">Light</${ToggleButton}><${ToggleButton} value="dark">Dark</${ToggleButton}><${ToggleButton} value="system">System</${ToggleButton}></${ToggleButtonGroup}>
            <${Divider} sx=${{my:1.5}}/>
            <${Stack} spacing=${.3}><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.reducedMotion} onChange=${e=>update(next=>next.settings.reducedMotion=e.target.checked)}/>`} label="Reduce animations"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.haptics} onChange=${e=>update(next=>next.settings.haptics=e.target.checked)}/>`} label="Vibration feedback"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.advancedDefault} onChange=${e=>update(next=>next.settings.advancedDefault=e.target.checked)}/>`} label="Show advanced workout fields by default"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.highContrast} onChange=${e=>update(next=>next.settings.highContrast=e.target.checked)}/>`} label="Higher interface contrast"/></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Weekly schedule" subtitle="Rest, active recovery and deload are real plan types"/>
            <${Stack} spacing=${1}>${weekdays.map((day,index)=>html`<${Stack} key=${day} direction="row" spacing=${1} alignItems="center"><${Typography} variant="body2" fontWeight=${700} sx=${{width:86,flexShrink:0}}>${day}</${Typography}><${TextField} select fullWidth value=${data.weeklyPlan[index]} onChange=${e=>savePlan(index,e.target.value)}><${MenuItem} value="push">Push</${MenuItem}><${MenuItem} value="pull">Pull</${MenuItem}><${MenuItem} value="legs">Legs</${MenuItem}><${MenuItem} value="upper">Upper</${MenuItem}><${MenuItem} value="lower">Lower</${MenuItem}><${MenuItem} value="full_body">Full body</${MenuItem}><${MenuItem} value="workout">Workout</${MenuItem}><${MenuItem} value="rest">Rest day</${MenuItem}><${MenuItem} value="active_recovery">Active recovery</${MenuItem}><${MenuItem} value="deload">Deload</${MenuItem}></${TextField}></${Stack}>`)}</${Stack}><${FormControlLabel} sx=${{mt:1}} control=${html`<${Switch} checked=${data.autoShiftMissed!==false} onChange=${e=>update(next=>next.autoShiftMissed=e.target.checked)}/>`} label="Move a missed workout forward"/>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Recovery check-in" subtitle=${readiness(data.recovery?.[recoveryDate])?.label||'No score yet'}/>
            <${Stack} spacing=${1.8}><${TextField} type="date" label="Date" value=${recoveryDate} onChange=${e=>setRecoveryDate(e.target.value)} InputLabelProps=${{shrink:true}} inputProps=${{max:localDateKey()}}/><${TextField} label="Sleep (hours)" type="number" value=${recoveryDraft.sleep} onChange=${e=>setRecoveryDraft({...recoveryDraft,sleep:e.target.value})} inputProps=${{min:0,max:16,step:.1}}/>
              ${[['Soreness','soreness'],['Energy','energy'],['Stress','stress']].map(([label,key])=>html`<${Box} key=${key}><${Stack} direction="row" justifyContent="space-between"><${Typography} variant="body2" fontWeight=${700}>${label}</${Typography}><${Typography} variant="body2" color="text.secondary">${recoveryDraft[key]}</${Typography}></${Stack}><${Slider} min=${1} max=${5} step=${1} marks value=${Number(recoveryDraft[key]||3)} onChange=${(_,value)=>setRecoveryDraft({...recoveryDraft,[key]:value})}/></${Box}>`)}
              <${TextField} label="Recovery note" multiline minRows=${2} value=${recoveryDraft.note||''} onChange=${e=>setRecoveryDraft({...recoveryDraft,note:e.target.value})}/><${Button} variant="contained" onClick=${saveRecovery}>Save check-in</${Button}>
            </${Stack}>
          </${CardShell}>
        </${Stack}>

        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Daily targets" subtitle="Nutrition dashboard goals"/>
            <${Box} sx=${{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1}}><${TextField} label="Calories" type="number" value=${data.calorieGoal} onChange=${e=>update(next=>next.calorieGoal=Number(e.target.value)||0)}/><${TextField} label="Protein (g)" type="number" value=${data.proteinGoal} onChange=${e=>update(next=>next.proteinGoal=Number(e.target.value)||0)}/><${TextField} label="Carbs (g)" type="number" value=${data.carbsGoal} onChange=${e=>update(next=>next.carbsGoal=Number(e.target.value)||0)}/><${TextField} label="Fat (g)" type="number" value=${data.fatGoal} onChange=${e=>update(next=>next.fatGoal=Number(e.target.value)||0)}/></${Box}>
            <${TextField} select fullWidth label="Weight unit" value=${data.preferredUnit} onChange=${e=>update(next=>next.preferredUnit=e.target.value)} sx=${{mt:1}}><${MenuItem} value="kg">Kilograms</${MenuItem}><${MenuItem} value="lb">Pounds</${MenuItem}></${TextField}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Private habit counter" subtitle="Optional, neutral and stored only on this device"/>
            <${FormControlLabel} control=${html`<${Switch} checked=${!!habit.enabled} onChange=${e=>update(next=>next.privateHabit.enabled=e.target.checked)}/>`} label="Enable private counter"/>
            ${habit.enabled?html`<${Stack} spacing=${1.2} sx=${{mt:1}}><${TextField} label="Label" value=${habit.label||'Private habit'} onChange=${e=>update(next=>next.privateHabit.label=e.target.value)}/><${TextField} type="date" label="Start date" value=${habit.startDate||''} onChange=${e=>update(next=>next.privateHabit.startDate=e.target.value)} InputLabelProps=${{shrink:true}}/><${Paper} variant="outlined" sx=${{p:2,textAlign:'center',borderRadius:3}}><${Typography} variant="caption" color="text.secondary">CURRENT STREAK</${Typography}><${Typography} variant="h4">${habit.hideCount?'•••':`${habitDays} days`}</${Typography}><${Typography} variant="caption" color="text.secondary">Personal best: ${habit.personalBest||0} days</${Typography}></${Paper}><${FormControlLabel} control=${html`<${Switch} checked=${!!habit.hideCount} onChange=${e=>update(next=>next.privateHabit.hideCount=e.target.checked)}/>`} label="Hide the count on screen"/><${Button} variant="outlined" color="error" onClick=${resetHabit}>Reset counter</${Button}></${Stack}>`:null}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Help and transparency" subtitle="Understand every technical field and update"/>
            <${Stack} spacing=${1}><${Button} variant="outlined" startIcon=${html`<${Icon} name="book"/>`} onClick=${()=>openGuide()}>Training Guide</${Button}><${Button} variant="outlined" startIcon=${html`<${Icon} name="spark"/>`} onClick=${openChangelog}>What’s New / Changelog</${Button}><${Alert} severity="info">Readiness and muscle-region suggestions are explainable training guidance—not medical advice.</${Alert}></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Data and reliability" subtitle="Permanent key: setline-data-v1"/>
            <${Stack} spacing=${1}><${Button} variant="contained" startIcon=${html`<${Icon} name="download"/>`} onClick=${exportData}>Export backup</${Button}><${Button} variant="outlined" component="label" startIcon=${html`<${Icon} name="upload"/>`}>Import and merge<input className="sr-only" type="file" accept="application/json" onChange=${e=>importData(e.target.files?.[0])}/></${Button}><${Button} variant="outlined" onClick=${restoreBackup}>Restore automatic backup</${Button}><${Button} variant="outlined" onClick=${integrity}>Run data-integrity check</${Button}><${Typography} variant="caption" color="text.secondary">${recordCount(data)} workout, nutrition and session records. Last save: ${data.updatedAt?new Date(data.updatedAt).toLocaleString():'Not recorded'}.</${Typography}></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="About Setline" subtitle=${'Version '+APP_VERSION+' · '+RELEASE_DATE}/>
            <${Typography} variant="body2" color="text.secondary">Setline is local-first. Updating files on GitHub Pages does not delete browser storage. Cross-device sync is not enabled yet.</${Typography}>
          </${CardShell}>
        </${Stack}>
      </div>
    </div>`;
  }

  function CompletionOverlay({summary,onClose,reducedMotion=false}){
    const [count,setCount]=useState(reducedMotion?summary.streak:0);
    useEffect(()=>{if(reducedMotion){setCount(summary.streak);return;}const start=performance.now(),duration=800;let frame;const tick=now=>{const p=Math.min(1,(now-start)/duration);setCount(Math.round(summary.streak*(1-Math.pow(1-p,3))));if(p<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[summary.streak,reducedMotion]);
    return html`<div className="completion-overlay" role="dialog" aria-modal="true" aria-label="Workout complete"><${Card} className="completion-card"><div className="completion-flame">🔥</div><${Typography} variant="overline" color="secondary.main" fontWeight=${900}>STREAK EXTENDED</${Typography}><${Typography} variant="h3" sx=${{fontWeight:900,my:.5}}>${count}</${Typography}><${Typography} variant="h5">${summary.name}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:1,mb:2}}>Your session, weekly muscle-region report and progress totals are saved.</${Typography}><${Box} sx=${{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,mb:2}}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${summary.exerciseCount}</${Typography}><${Typography} variant="caption" color="text.secondary">Exercises</${Typography}></${Paper}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${summary.setCount}</${Typography}><${Typography} variant="caption" color="text.secondary">Sets</${Typography}></${Paper}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${Math.round(summary.volume)}</${Typography}><${Typography} variant="caption" color="text.secondary">Volume</${Typography}></${Paper}></${Box}>${summary.regions?.length?html`<${Box} sx=${{display:'flex',justifyContent:'center',gap:.6,flexWrap:'wrap',mb:2}}>${summary.regions.slice(0,5).map(r=>html`<${Chip} key=${r} label=${REGION_META[r]?.[0]||r} size="small"/>`)}</${Box}>`:null}<${Button} fullWidth variant="contained" size="large" onClick=${onClose}>Done</${Button}></${Card}></div>`;
  }

  function DesktopNav({tab,onChange}){
    const nav=[['home','Home'],['workout','Workout'],['nutrition','Nutrition'],['progress','Progress'],['profile','Profile']];
    return html`<${Drawer} className="side-nav-desktop" variant="permanent" sx=${{width:230,flexShrink:0,'& .MuiDrawer-paper':{width:230,boxSizing:'border-box',borderRight:'1px solid',borderColor:'divider',p:2,backgroundImage:'none'}}}><${Stack} direction="row" spacing=${1.2} alignItems="center" sx=${{px:1,py:1.5,mb:1}}><${Avatar} src="./setline-s.svg" variant="rounded"/><${Box}><${Typography} variant="h6">Setline</${Typography}><${Typography} variant="caption" color="text.secondary">Know what to train next</${Typography}></${Box}></${Stack}><${List} sx=${{flex:1}}>${nav.map(([value,label])=>html`<${ListItemButton} key=${value} selected=${tab===value} onClick=${()=>onChange(value)} sx=${{borderRadius:3,mb:.5,minHeight:48}}><${ListItemIcon} sx=${{minWidth:40,color:tab===value?'primary.main':'text.secondary'}}><${Icon} name=${value}/></${ListItemIcon}><${ListItemText} primary=${label} primaryTypographyProps=${{fontWeight:tab===value?800:650}}/></${ListItemButton}>`)}</${List}><${Paper} variant="outlined" sx=${{p:1.3,borderRadius:3}}><${Typography} variant="caption" color="text.secondary">SETLINE</${Typography}><${Typography} variant="body2" fontWeight=${800}>v${APP_VERSION}</${Typography}></${Paper}></${Drawer}>`;
  }

  function App(){
    const [data,update]=useSetlineState();
    const systemDark=useMediaQuery('(prefers-color-scheme: dark)');
    const resolvedMode=data.settings.theme==='system'?(systemDark?'dark':'light'):(data.settings.theme||'dark');
    const theme=useMemo(()=>makeTheme(resolvedMode,!!data.settings.highContrast),[resolvedMode,data.settings.highContrast]);
    const [tab,setTab]=useState('home'); const [selectedDate,setSelectedDate]=useState(localDateKey());
    const [guide,setGuide]=useState({open:false,term:''}); const [changelogOpen,setChangelogOpen]=useState(false); const [onboardingOpen,setOnboardingOpen]=useState(()=>!data.onboardingComplete&&recordCount(data)===0);
    const [feedback,setFeedback]=useState(''); const feedbackTimer=useRef(null); const [completion,setCompletion]=useState(null); const [online,setOnline]=useState(navigator.onLine); const [updateReady,setUpdateReady]=useState(null);
    useServiceWorker(setUpdateReady);
    useEffect(()=>{setThemeMeta(resolvedMode);document.documentElement.style.colorScheme=resolvedMode;document.body.classList.toggle('reduce-motion',!!data.settings.reducedMotion);},[resolvedMode,data.settings.reducedMotion]);
    useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off);};},[]);
    const navigate=value=>{setTab(value);window.scrollTo({top:0,behavior:data.settings.reducedMotion?'auto':'smooth'});};
    const showFeedback=message=>{setFeedback(message);clearTimeout(feedbackTimer.current);feedbackTimer.current=setTimeout(()=>setFeedback(''),850);if(data.settings.haptics){try{navigator.vibrate?.(35);}catch(err){}}};
    const showCompletion=summary=>{setCompletion({...summary,streak:calculateStreak(data)});if(data.settings.haptics){try{navigator.vibrate?.([60,50,90]);}catch(err){}}};
    const openGuide=term=>setGuide({open:true,term:term||''});
    const closeChangelog=()=>{setChangelogOpen(false);update(next=>next.changelogSeen=APP_VERSION);};
    const applyUpdate=()=>{if(updateReady?.waiting){try{localStorage.setItem(BACKUP_KEY,JSON.stringify(data));}catch(err){}updateReady.waiting.postMessage({type:'SKIP_WAITING'});}else window.location.reload();};
    const pageProps={data,update,selectedDate,setSelectedDate,openGuide,showFeedback};
    const currentPage=tab==='home'?html`<${HomePage} ...${pageProps} navigate=${navigate}/>`:tab==='workout'?html`<${WorkoutPage} ...${pageProps} showCompletion=${showCompletion}/>`:tab==='nutrition'?html`<${NutritionPage} ...${pageProps}/>`:tab==='progress'?html`<${ProgressPage} ...${pageProps}/>`:html`<${ProfilePage} data=${data} update=${update} openGuide=${openGuide} openChangelog=${()=>setChangelogOpen(true)} showFeedback=${showFeedback} openOnboarding=${()=>setOnboardingOpen(true)} updateReady=${updateReady} applyUpdate=${applyUpdate}/>`;
    return html`<${ThemeProvider} theme=${theme}><${CssBaseline}/><${Box} id="app-shell" sx=${{display:'flex',bgcolor:'background.default',color:'text.primary'}}><${DesktopNav} tab=${tab} onChange=${navigate}/><${Box} component="main" sx=${{flex:1,minWidth:0}}>${currentPage}</${Box}>
      <${BottomNavigation} className="bottom-nav-mobile" showLabels value=${tab} onChange=${(_,value)=>navigate(value)} sx=${{position:'fixed',left:0,right:0,bottom:0,zIndex:1300}}><${BottomNavigationAction} value="home" label="Home" icon=${html`<${Icon} name="home"/>`}/><${BottomNavigationAction} value="workout" label="Workout" icon=${html`<${Icon} name="workout"/>`}/><${BottomNavigationAction} value="nutrition" label="Nutrition" icon=${html`<${Icon} name="nutrition"/>`}/><${BottomNavigationAction} value="progress" label="Progress" icon=${html`<${Icon} name="progress"/>`}/><${BottomNavigationAction} value="profile" label="Profile" icon=${html`<${Icon} name="profile"/>`}/></${BottomNavigation}>
      ${!online?html`<div className="offline-pill">Offline · local data still works</div>`:null}
      ${updateReady&&tab!=='profile'?html`<${Paper} className="update-banner" elevation=${12} sx=${{p:1.3,display:'flex',alignItems:'center',justifyContent:'space-between',gap:1.5}}><${Box}><${Typography} fontWeight=${800}>Update ready</${Typography}><${Typography} variant="caption" color="text.secondary">A backup will be made before reloading.</${Typography}></${Box}><${Button} size="small" variant="contained" onClick=${applyUpdate}>Update</${Button}></${Paper}>`:null}
      ${data.changelogSeen!==APP_VERSION&&!changelogOpen?html`<${Paper} elevation=${12} sx=${{position:'fixed',left:{xs:12,sm:'auto'},right:{xs:12,sm:24},bottom:'calc(82px + env(safe-area-inset-bottom))',zIndex:1250,p:1.3,borderRadius:3,display:'flex',alignItems:'center',gap:1.5,maxWidth:390}}><${Avatar} sx=${{bgcolor:'primary.main'}}><${Icon} name="spark"/></${Avatar}><${Box} sx=${{flex:1}}><${Typography} fontWeight=${800}>Setline 6.6 is here</${Typography}><${Typography} variant="caption" color="text.secondary">The biggest Setline update yet.</${Typography}></${Box}><${Button} size="small" onClick=${()=>setChangelogOpen(true)}>View</${Button}><${IconButton} size="small" onClick=${()=>update(next=>next.changelogSeen=APP_VERSION)}><${Icon} name="close"/></${IconButton}></${Paper}>`:null}
      ${feedback?html`<div className="save-pop"><${Typography} fontWeight=${850}>✓ ${feedback}</${Typography}></div>`:null}
      ${completion?html`<${CompletionOverlay} summary=${completion} reducedMotion=${data.settings.reducedMotion} onClose=${()=>setCompletion(null)}/>`:null}
      <${TrainingGuideDialog} open=${guide.open} initialTerm=${guide.term} onClose=${()=>setGuide({open:false,term:''})}/><${ChangelogDialog} open=${changelogOpen} onClose=${closeChangelog}/><${OnboardingDialog} open=${onboardingOpen} data=${data} update=${update} onClose=${()=>setOnboardingOpen(false)}/>
    </${Box}></${ThemeProvider}>`;
  }

  ReactDOM.createRoot(rootNode).render(html`<${App}/>`);
})();
