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

  const APP_VERSION = '7.0.1';
  const RELEASE_DATE = 'August 8, 2026';
  const STORAGE_KEY = 'setline-data-v1';
  const BACKUP_KEY = 'setline-data-last-good-v1';
  const PRE_MIGRATION_KEY = 'setline-pre-v7-backup';
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
    spark:'M12 2l1.55 5.45L19 9l-5.45 1.55L12 16l-1.55-5.45L5 9l5.45-1.55L12 2zm7 12l.9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14z',
    trophy:'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.21 1.79 4 4 4h.18A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1A5.01 5.01 0 0016.82 12H17c2.21 0 4-1.79 4-4V7c0-1.1-.9-2-2-2zM7 10c-1.1 0-2-.9-2-2V7h2v3zm8 1a3 3 0 01-6 0V5h6v6zm4-3c0 1.1-.9 2-2 2V7h2v1z',
    target:'M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-14a6 6 0 106 6 6 6 0 00-6-6zm0 10a4 4 0 114-4 4 4 0 01-4 4zm0-6a2 2 0 102 2 2 2 0 00-2-2z',
    bolt:'M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.4 0 .62.19.4.66C12.97 17.53 11 21 11 21z',
    lock:'M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-9-2a3 3 0 016 0v2H9V6zm9 14H6V10h12v10z'
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
  function normalizeUnit(unit){ return String(unit).toLowerCase()==='lb'?'lb':'kg'; }
  function convertWeight(value,fromUnit,toUnit){
    const number=Number(value)||0,from=normalizeUnit(fromUnit),to=normalizeUnit(toUnit);
    if(from===to)return number;
    return from==='kg'?number*2.2046226218:number/2.2046226218;
  }
  function exerciseKey(name=''){ return String(name).trim().toLowerCase().replace(/\s+/g,' '); }
  function formatLoad(value,unit){ return `${round1(value)} ${normalizeUnit(unit)}`; }
  function convertedLoadText(value,fromUnit,toUnit){
    if(!Number(value)||normalizeUnit(fromUnit)===normalizeUnit(toUnit))return '';
    return `≈ ${formatLoad(convertWeight(value,fromUnit,toUnit),toUnit)}`;
  }
  function deepClone(value){ return typeof structuredClone==='function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)); }
  function recordCount(data){ return Object.values(data?.days||{}).reduce((sum,day)=>sum+(day?.workouts?.length||0)+(day?.calories?.length||0)+(day?.sessions?.length||0),0); }
  function getDay(data,key){ const day=data?.days?.[key]||{}; return {workouts:Array.isArray(day.workouts)?day.workouts:[],calories:Array.isArray(day.calories)?day.calories:[],sessions:Array.isArray(day.sessions)?day.sessions:[],...day}; }
  function getSets(workout,fallbackUnit='kg'){
    const workoutUnit=normalizeUnit(workout?.unit||workout?.weightUnit||fallbackUnit);
    if(Array.isArray(workout?.setEntries) && workout.setEntries.length) return workout.setEntries.map((set,index)=>({id:set.id||id('set'),load:Number(set.load??set.weight??0),unit:normalizeUnit(set.unit||set.weightUnit||workoutUnit),reps:Number(set.reps??0),done:set.done!==false,type:set.type||'working',rir:set.rir??'',rpe:set.rpe??'',note:set.note||'',index}));
    const count=Math.max(1,Number(workout?.sets)||1); return Array.from({length:count},(_,index)=>({id:id('set'),load:Number(workout?.load||0),unit:workoutUnit,reps:Number(workout?.reps||0),done:true,type:'working',rir:'',rpe:'',note:'',index}));
  }
  function setVolume(set,outputUnit='kg'){
    if(set.done===false || set.type==='warmup')return 0;
    return convertWeight(Number(set.load)||0,set.unit||'kg',outputUnit)*(Number(set.reps)||0);
  }

  const DEFAULT_TARGETS = {upper_chest:4,chest:6,lats:8,upper_back:6,lower_back:3,front_delts:3,side_delts:6,rear_delts:5,biceps:6,triceps:6,forearms:3,quads:8,hamstrings:6,glutes:6,calves:6,core:5};
  const REGION_META = {
    upper_chest:['Upper chest','Push'],chest:['Chest','Push'],lats:['Lats','Pull'],upper_back:['Upper back','Pull'],lower_back:['Lower back','Pull'],front_delts:['Front delts','Push'],side_delts:['Side delts','Push'],rear_delts:['Rear delts','Pull'],biceps:['Biceps','Pull'],triceps:['Triceps','Push'],forearms:['Forearms','Pull'],quads:['Quads','Legs'],hamstrings:['Hamstrings','Legs'],glutes:['Glutes','Legs'],calves:['Calves','Legs'],core:['Core','Core']
  };
  const EXERCISE_DEFINITIONS = [
    {pattern:/^(seated |lying |prone |standing |single[- ]leg )?(machine )?(leg|hamstring) curls?$/i,primary:['hamstrings'],secondary:['calves'],machineProfile:'selectorized'},
    {pattern:/^leg extensions?$/i,primary:['quads'],secondary:[],machineProfile:'selectorized'},
    {pattern:/^hack squats?$/i,primary:['quads'],secondary:['glutes'],machineProfile:'plate_loaded'},
    {pattern:/^leg press(es)?$/i,primary:['quads'],secondary:['glutes'],machineProfile:'plate_loaded'},
    {pattern:/^lat pulldowns?$/i,primary:['lats'],secondary:['biceps','upper_back'],machineProfile:'cable_stack'},
    {pattern:/^seated cable rows?$/i,primary:['upper_back','lats'],secondary:['biceps','rear_delts'],machineProfile:'cable_stack'},
    {pattern:/^face pulls?$/i,primary:['rear_delts'],secondary:['upper_back'],machineProfile:'cable_stack'},
    {pattern:/^(cable )?lateral raises?$/i,primary:['side_delts'],secondary:['front_delts'],machineProfile:'cable_stack'},
    {pattern:/^rope triceps pushdowns?$/i,primary:['triceps'],secondary:[],machineProfile:'cable_stack'},
    {pattern:/^cable crunch(es)?$/i,primary:['core'],secondary:[],machineProfile:'cable_stack'},
    {pattern:/^chest press(es)?$/i,primary:['chest'],secondary:['front_delts','triceps'],machineProfile:'selectorized'},
    {pattern:/^pec deck$/i,primary:['chest'],secondary:['front_delts'],machineProfile:'selectorized'}
  ];
  const EXERCISE_MAP = [
    [/incline.*press|incline.*fly|low.to.high/i,['upper_chest'],['front_delts','triceps']],
    [/bench press|chest press|push.?up|pec deck|chest fly|cable fly|dumbbell press/i,['chest'],['front_delts','triceps']],
    [/overhead press|shoulder press|arnold press/i,['front_delts'],['side_delts','triceps']],
    [/lateral raise|upright row/i,['side_delts'],['front_delts']],
    [/rear delt|reverse fly|face pull/i,['rear_delts'],['upper_back']],
    [/lat pulldown|pull.?up|chin.?up|straight.arm pulldown/i,['lats'],['biceps','upper_back']],
    [/row|t.bar|seal row/i,['upper_back','lats'],['biceps','rear_delts']],
    [/romanian|rdl|leg curl|hamstring/i,['hamstrings'],['glutes','lower_back']],
    [/deadlift|back extension|good morning/i,['lower_back','glutes','hamstrings'],['upper_back']],
    [/triceps|pushdown|skull crusher|dip|overhead extension/i,['triceps'],['chest','front_delts']],
    [/biceps|curl|preacher|hammer/i,['biceps'],['forearms']],
    [/wrist|farmer|grip/i,['forearms'],[]],
    [/squat|leg press|hack squat|leg extension|split squat|lunge/i,['quads'],['glutes']],
    [/hip thrust|glute bridge|kickback/i,['glutes'],['hamstrings']],
    [/calf/i,['calves'],[]],
    [/crunch|plank|sit.?up|ab wheel|leg raise|pallof/i,['core'],[]]
  ];
  const REGION_SUGGESTIONS={upper_chest:['incline dumbbell press','low-to-high cable fly'],chest:['chest press','cable fly'],lats:['lat pulldown','single-arm pulldown'],upper_back:['chest-supported row','seated cable row'],lower_back:['back extension','Romanian deadlift'],front_delts:['overhead press','Arnold press'],side_delts:['cable lateral raise','dumbbell lateral raise'],rear_delts:['reverse fly','face pull'],biceps:['preacher curl','incline curl'],triceps:['overhead extension','rope pushdown'],forearms:['hammer curl','farmer carry'],quads:['hack squat','leg extension'],hamstrings:['Romanian deadlift','leg curl'],glutes:['hip thrust','Bulgarian split squat'],calves:['standing calf raise','seated calf raise'],core:['cable crunch','ab wheel']};

  function exerciseDefinition(name=''){
    const clean=String(name).trim();
    return EXERCISE_DEFINITIONS.find(item=>item.pattern.test(clean))||null;
  }
  function inferredMachineProfile(name=''){
    const defined=exerciseDefinition(name); if(defined?.machineProfile)return defined.machineProfile;
    const clean=String(name).toLowerCase();
    if(/cable|pulldown|pushdown|face pull/.test(clean))return 'cable_stack';
    if(/machine|extension|leg curl/.test(clean))return 'selectorized';
    if(/hack squat|leg press|plate.loaded/.test(clean))return 'plate_loaded';
    if(/smith/.test(clean))return 'smith_machine';
    if(/bodyweight|push.?up|pull.?up|plank/.test(clean))return 'bodyweight';
    return 'free_weight';
  }

  const MACHINE_TYPES=[
    {value:'free_weight',label:'Free weights',kg:2.5,lb:5},
    {value:'cable_stack',label:'Cable stack',kg:2.5,lb:5},
    {value:'selectorized',label:'Selectorized machine',kg:5,lb:10},
    {value:'smith_machine',label:'Smith machine',kg:2.5,lb:5},
    {value:'plate_loaded',label:'Plate-loaded machine',kg:5,lb:10},
    {value:'bodyweight',label:'Bodyweight',kg:1,lb:1},
    {value:'custom',label:'Custom / other',kg:1,lb:1}
  ];
  function machineTypeInfo(value){ return MACHINE_TYPES.find(item=>item.value===value)||MACHINE_TYPES[0]; }
  function machineIncrement(value,unit){ const info=machineTypeInfo(value); return Number(info[normalizeUnit(unit)])||1; }
  function exerciseSetting(data,name,previous=null){
    const remembered=data.exerciseSettings?.[exerciseKey(name)]||{};
    const previousUnit=previous?(previous.unit||getSets(previous,data.preferredUnit)[0]?.unit):'';
    const unit=normalizeUnit(previousUnit||remembered.unit||data.preferredUnit);
    let machineProfile=previous?.machineProfile||remembered.machineProfile||inferredMachineProfile(name);
    const defined=exerciseDefinition(name);
    if(defined?.machineProfile && (!machineProfile||machineProfile==='free_weight'))machineProfile=defined.machineProfile;
    return {unit,machineProfile,increment:Number(previous?.increment||remembered.increment||machineIncrement(machineProfile,unit)),unitLocked:false};
  }

  function classifyExercise(name=''){
    const defined=exerciseDefinition(name);
    if(defined)return {primary:defined.primary,secondary:defined.secondary};
    const found=EXERCISE_MAP.find(([pattern])=>pattern.test(name));
    return found ? {primary:found[1],secondary:found[2]} : {primary:[],secondary:[]};
  }

  const COMMON_FOODS = [
    {name:'Boiled egg',aliases:['boiled eggs','hard boiled egg','egg'],amount:1,unit:'piece',kcal:78,protein:6.3,carbs:.6,fat:5.3,note:'1 large egg'},
    {name:'Chicken breast, cooked',aliases:['chicken breast','cooked chicken'],amount:100,unit:'g',kcal:165,protein:31,carbs:0,fat:3.6,note:'per 100 g'},
    {name:'White rice, cooked',aliases:['cooked rice','rice'],amount:100,unit:'g',kcal:130,protein:2.4,carbs:28.2,fat:.3,note:'per 100 g'},
    {name:'Rolled oats, dry',aliases:['oats','oatmeal'],amount:100,unit:'g',kcal:379,protein:13.2,carbs:67.7,fat:6.5,note:'per 100 g'},
    {name:'Banana',aliases:['banana medium'],amount:1,unit:'piece',kcal:105,protein:1.3,carbs:27,fat:.4,note:'1 medium'},
    {name:'Milk, 2%',aliases:['2 percent milk','milk'],amount:250,unit:'ml',kcal:122,protein:8.1,carbs:12,fat:4.8,note:'per 250 ml'},
    {name:'Plain yogurt',aliases:['yogurt','curd'],amount:100,unit:'g',kcal:61,protein:3.5,carbs:4.7,fat:3.3,note:'per 100 g'}
  ];

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
    {term:'Progressive overload',title:'Progressive Overload',summary:'Gradually increase training demand while technique and recovery remain acceptable.',example:'Add one rep, a small amount of load, or an additional set—not everything at once.',tags:['progression']},
    {term:'Mixed units',title:'Kilograms and Pounds',summary:'Every set stores the original load and unit used on that machine. The global unit is only a default and chart display preference.',example:'Leg press 180 lb and cable lateral raise 10 kg can exist in the same workout without rewriting either value.',tags:['kg','lb','units','machine']},
    {term:'Full Body',title:'Full-Body Split',summary:'Each session trains most major muscle groups. It is efficient when you have fewer training days.',example:'Mon: Full Body · Wed: Full Body · Fri: Full Body',recommended:'2–4 days per week',advantages:'High training frequency, flexible scheduling, and fewer missed muscle groups.',drawbacks:'Sessions can become long if too many exercises are added.',bestFor:'Beginners, busy schedules, or anyone training two to four days.',tags:['split','program','beginner']},
    {term:'Upper / Lower',title:'Upper–Lower Split',summary:'Upper-body sessions alternate with lower-body sessions so each area can be trained more than once weekly.',example:'Mon: Upper · Tue: Lower · Thu: Upper · Fri: Lower',recommended:'3–4 days per week',advantages:'Simple recovery pattern and balanced frequency.',drawbacks:'Upper sessions can become crowded if every arm and shoulder isolation is included.',bestFor:'Beginners through advanced lifters who want a balanced schedule.',tags:['split','program','upper lower']},
    {term:'Push / Pull / Legs',title:'PPL Split',summary:'Push trains chest, shoulders and triceps; Pull trains back and biceps; Legs trains the lower body.',example:'Mon: Push · Wed: Pull · Fri: Legs, or repeat the cycle across six days.',recommended:'3 or 6 days per week',advantages:'Clear movement grouping and focused sessions.',drawbacks:'Missing one day can delay an entire muscle group unless the cycle is moved forward.',bestFor:'Intermediate lifters who enjoy focused sessions and consistent scheduling.',tags:['split','program','ppl','push pull legs']},
    {term:'PPL + Upper / Lower',title:'PPLUL Hybrid Split',summary:'A five-session hybrid: three focused Push/Pull/Legs days followed by broader Upper and Lower sessions.',example:'Mon: Push · Tue: Pull · Wed: Legs · Fri: Upper · Sat: Lower',recommended:'5 days per week',advantages:'Combines focused sessions with a second weekly exposure for most muscle groups.',drawbacks:'Requires five reliable training days and fatigue must be managed carefully.',bestFor:'Intermediate or advanced lifters who recover well from five sessions.',tags:['split','program','pplul','hybrid']},
    {term:'Bro Split',title:'Body-Part Split',summary:'Each session focuses mainly on one body area, commonly chest, back, shoulders, arms and legs.',example:'Mon: Chest · Tue: Back · Wed: Shoulders · Fri: Arms · Sat: Legs',recommended:'5 days per week',advantages:'Focused sessions, plenty of exercise variety, and easy local fatigue management.',drawbacks:'Most regions may be trained only once weekly; missing a day can mean missing that body part for the week.',bestFor:'Experienced lifters who prefer high-focus sessions and can train five days consistently.',tags:['split','program','bro split','body part']},
    {term:'Custom Split',title:'Custom Weekly Split',summary:'Build your own weekly sequence using any combination of workout and recovery day types.',example:'Upper · Lower · Rest · Push · Pull · Rest · Active recovery',recommended:'1–7 planned days',advantages:'Maximum flexibility for work schedules, sport practice, and personal preferences.',drawbacks:'Balance and recovery depend on the quality of your plan.',bestFor:'Users who already understand their training needs.',tags:['split','program','custom']}
  ];

  const CHANGELOG = [
    {version:'7.0.1',date:RELEASE_DATE,items:['New editorial Setline visual system inspired by clean Figma case-study layouts','Warm off-white light mode and charcoal dark mode with restrained pastel tiles','Inter Tight typography, tighter hierarchy and simpler black-and-white controls','Home metrics, today plan, XP, recovery and weekly focus now use a modular color grid','Flattened cards, compact fields and less Material-style visual chrome','All Setline 7 features and the permanent data key remain unchanged']},
    {version:'7.0.0',date:RELEASE_DATE,items:['New custom minimal Setline interface with compact typography, thin dividers and restrained color','Workout Focus Mode shows one exercise at a time with previous performance, load, reps and RIR','Setline XP and levels reward completed sessions, working sets, consistency, recovery days and personal records','Weekly missions focus on workouts, quality sets, protein consistency and muscle-region coverage','Exercise mastery, personal milestones and a guilt-free Comeback Mode','Existing mixed-unit workouts, nutrition, profile and history remain under the permanent data key']},
    {version:'6.6.4',date:RELEASE_DATE,items:['Compact minimal interface with smaller cards, typography and spacing','Visible kg/lb toggle on every exercise without automatic locking','Per-set remove control with confirmation for completed sets','Exact exercise definitions prevent Leg Curl from inheriting arm tags','Known machine exercises receive sensible equipment defaults','Generic food presets including boiled eggs plus packaged-food search','Keyboard-safe mobile food logger and corrected floating-label spacing']},
    {version:'6.6.3',date:'August 6, 2026',items:['Added per-exercise kg/lb units while preserving every original load value','Exercise unit memory and optional unit locking for mixed commercial gyms','Machine profiles with remembered weight increments','Original and converted load display without rewriting history','Normalized volume charts and personal records across kg and lb','Workout CSV export now includes each set’s stored unit']},
    {version:'6.6.2',date:'August 5, 2026',items:['Fixed the Run Setup training-days selector so 1–7 saves independently','Professional eight-step setup wizard with equipment and movement selections','Added PPL + Upper/Lower and Bro Split with exact weekly schedule previews','Added complete split explanations to the Training Guide','Streak flame now flickers continuously and Easter eggs show quote attribution','Added a unified fluid motion system with reduced-motion support']},
    {version:'6.6.1',date:RELEASE_DATE,items:['Fixed profile, progress and nutrition clipping and spacing','Tappable Home metrics with compact bottom-sheet details and shortcuts','Seven-day mini trends and customizable Home metric order','Upper and Lower starter workout templates alongside Push, Pull and Legs','Random streak-tap Easter-egg motivation lines','Improved bottom-navigation clearance and small-screen layout']},
    {version:'6.6.0',date:RELEASE_DATE,items:['Complete React and Material UI interface rebuild','Light, dark and system themes','Faster workout logging with previous-set prefilling','Searchable Training Guide with contextual explanations','Explainable weekly muscle-region coaching','Redesigned nutrition day view and food editor','Unified Progress hub, onboarding, changelog and data tools','Automatic pre-migration backup and non-destructive storage migration']},
    {version:'6.5.3',date:'August 2026',items:['Readiness guidance','Completion and streak animations','Deep navy visual refresh','Update and data-integrity tools']},
    {version:'6.5.2',date:'August 2026',items:['Rest days, active recovery and deloads','Weekly training calendar','Recovery check-in','Responsive safe-area layout']},
    {version:'6.5.1',date:'August 2026',items:['Saved meals, recipes, favourites and barcode lookup','Private habit counter','Nutrition improvements']}
  ];

  function defaultState(){
    return {
      days:{}, calorieGoal:3200, proteinGoal:160, carbsGoal:420, fatGoal:95,
      routines:{}, preferredUnit:'kg', bodyWeightKg:72, bodyWeights:{}, autoRest:true,
      restSeconds:90, machineProfiles:{}, exerciseSettings:{}, liveSession:null, workoutDrafts:{},
      profile:{name:'',goal:'build_muscle',experience:'intermediate',split:'push_pull_legs',trainingDays:4,equipment:['commercial_gym'],avoid:'',avoidMovements:[],avoidNote:'',notes:''},
      regionTargets:{...DEFAULT_TARGETS}, foodLibrary:[], favoriteFoods:[], recentFoods:[], savedMeals:[],
      privateHabit:{enabled:false,label:'Private habit',startDate:'',personalBest:0,hideCount:true},
      schedule:{}, weeklyPlan:['push','pull','legs','rest','push','pull','rest'], autoShiftMissed:true,
      recovery:{}, scheduleMeta:{configured:false,lastProcessed:''},
      settings:{theme:'system',reducedMotion:false,haptics:true,advancedDefault:false,highContrast:false,showUnitConversions:true,homeCardOrder:['calories','protein','readiness','bodyweight'],hiddenHomeCards:[]},
      gamification:{enabled:true,showXP:true,claimedMilestones:[],lastCelebration:''},
      onboardingComplete:false, changelogSeen:'', schemaVersion:9, updatedAt:null
    };
  }

  function normaliseDays(days,legacyUnit='kg'){
    const output={};
    if(!days||typeof days!=='object')return output;
    for(const [date,rawDay] of Object.entries(days)){
      const day=rawDay&&typeof rawDay==='object'?rawDay:{};
      const workouts=Array.isArray(day.workouts)?day.workouts.map(raw=>{
        const workout=raw&&typeof raw==='object'?raw:{};
        const unit=normalizeUnit(workout.unit||workout.weightUnit||legacyUnit);
        const setEntries=Array.isArray(workout.setEntries)?workout.setEntries.map(set=>({...set,unit:normalizeUnit(set?.unit||set?.weightUnit||unit)})):workout.setEntries;
        const defined=exerciseDefinition(workout.name||'');
        let machineProfile=workout.machineProfile||inferredMachineProfile(workout.name||'');
        if(defined?.machineProfile && (!machineProfile||machineProfile==='free_weight'))machineProfile=defined.machineProfile;
        const increment=Number(workout.increment)||machineIncrement(machineProfile,unit);
        return {...workout,unit,machineProfile,increment,unitLocked:false,setEntries};
      }):[];
      output[date]={...day,workouts,calories:Array.isArray(day.calories)?day.calories:[],sessions:Array.isArray(day.sessions)?day.sessions:[]};
    }
    return output;
  }

  function normaliseState(parsed){
    const fallback=defaultState();
    if(!parsed||typeof parsed!=='object') return fallback;
    const preferredUnit=normalizeUnit(parsed.preferredUnit||fallback.preferredUnit);
    return {
      ...fallback,...parsed,
      days:normaliseDays(parsed.days,preferredUnit),
      routines:parsed.routines&&typeof parsed.routines==='object'?parsed.routines:{},
      bodyWeights:parsed.bodyWeights&&typeof parsed.bodyWeights==='object'?parsed.bodyWeights:{},
      machineProfiles:parsed.machineProfiles&&typeof parsed.machineProfiles==='object'?parsed.machineProfiles:{},
      exerciseSettings:Object.fromEntries(Object.entries(parsed.exerciseSettings&&typeof parsed.exerciseSettings==='object'?parsed.exerciseSettings:{}).map(([name,setting])=>{const safe=setting&&typeof setting==='object'?setting:{};const unit=normalizeUnit(safe.unit||preferredUnit);const defined=exerciseDefinition(name);let machineProfile=safe.machineProfile||inferredMachineProfile(name);if(defined?.machineProfile&&(!machineProfile||machineProfile==='free_weight'))machineProfile=defined.machineProfile;return [name,{...safe,unit,machineProfile,increment:Number(safe.increment)||machineIncrement(machineProfile,unit),unitLocked:false}];})),
      workoutDrafts:parsed.workoutDrafts&&typeof parsed.workoutDrafts==='object'?parsed.workoutDrafts:{},
      profile:{...fallback.profile,...(parsed.profile||{}),trainingDays:clamp(parsed.profile?.trainingDays??fallback.profile.trainingDays,1,7),equipment:Array.isArray(parsed.profile?.equipment)?parsed.profile.equipment:fallback.profile.equipment,avoidMovements:Array.isArray(parsed.profile?.avoidMovements)?parsed.profile.avoidMovements:(parsed.profile?.avoid?String(parsed.profile.avoid).split(',').map(v=>v.trim()).filter(Boolean):[])},
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
      gamification:{...fallback.gamification,...(parsed.gamification||{})},
      preferredUnit,
      calorieGoal:Number(parsed.calorieGoal)||fallback.calorieGoal,
      proteinGoal:Number(parsed.proteinGoal)||fallback.proteinGoal,
      carbsGoal:Number(parsed.carbsGoal)||fallback.carbsGoal,
      fatGoal:Number(parsed.fatGoal)||fallback.fatGoal,
      bodyWeightKg:Number(parsed.bodyWeightKg)||fallback.bodyWeightKg,
      restSeconds:clamp(parsed.restSeconds||fallback.restSeconds,15,600),
      schemaVersion:9
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
    result.machineProfiles={...other.machineProfiles,...result.machineProfiles}; result.exerciseSettings={...other.exerciseSettings,...result.exerciseSettings}; result.workoutDrafts={...other.workoutDrafts,...result.workoutDrafts};
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
    if(Number(loaded.schemaVersion||1)<9 || !loaded.settings){
      try{localStorage.setItem(PRE_MIGRATION_KEY,JSON.stringify({app:'Setline',version:APP_VERSION,backedUpAt:new Date().toISOString(),data:loaded}));}catch(err){}
    }
    loaded=normaliseState(loaded); loaded.schemaVersion=9;
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
      localStorage.setItem(STORAGE_KEY,JSON.stringify({...data,schemaVersion:9,updatedAt:new Date().toISOString()}));
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
    const best={};
    for(const w of allWorkouts(data)){
      for(const set of getSets(w,data.preferredUnit)){
        if(set.done===false||set.type==='warmup')continue;
        const load=Number(set.load)||0,reps=Number(set.reps)||0,unit=normalizeUnit(set.unit||w.unit||data.preferredUnit);
        const estimateKg=convertWeight(load,unit,'kg')*(1+reps/30),key=w.name||'Exercise';
        if(!best[key]||estimateKg>best[key].estimateKg)best[key]={name:key,load,unit,reps,estimateKg,date:w.date};
      }
    }
    return Object.values(best).sort((a,b)=>b.estimateKg-a.estimateKg).slice(0,8).map(item=>({...item,estimate:convertWeight(item.estimateKg,'kg',data.preferredUnit)}));
  }


  function weekDateKeys(endKey=localDateKey()){
    const start=mondayOf(endKey); return Array.from({length:7},(_,i)=>shiftDateKey(start,i));
  }
  function completedWorkingSetsForDay(data,key){
    return getDay(data,key).workouts.reduce((sum,workout)=>sum+getSets(workout,data.preferredUnit).filter(set=>set.done!==false&&set.type!=='warmup').length,0);
  }
  function exerciseMastery(data){
    const map=new Map();
    for(const [date,day] of Object.entries(data.days||{})){
      for(const workout of day.workouts||[]){
        const key=exerciseKey(workout.name),record=map.get(key)||{name:workout.name,sessions:new Set(),sets:0,lastDate:date};
        record.sessions.add(date); record.sets+=getSets(workout,data.preferredUnit).filter(set=>set.done!==false&&set.type!=='warmup').length;
        if(date>record.lastDate)record.lastDate=date; map.set(key,record);
      }
    }
    return [...map.values()].map(record=>{
      const sessions=record.sessions.size;
      const tier=sessions>=20?'Mastered':sessions>=8?'Skilled':sessions>=3?'Consistent':'Beginner';
      const next=sessions>=20?20:sessions>=8?20:sessions>=3?8:3;
      return {...record,sessions,tier,next,progress:sessions>=20?100:clamp(sessions/next*100,0,100)};
    }).sort((a,b)=>b.sessions-a.sessions||b.sets-a.sets);
  }
  function progressionSummary(data,endKey=localDateKey()){
    let completedSets=0,workoutDays=0,sessions=0,plannedRestDays=0;
    for(const [date,day] of Object.entries(data.days||{})){
      if(date>endKey)continue;
      const sets=completedWorkingSetsForDay(data,date); completedSets+=sets;
      if((day.workouts||[]).length){workoutDays++;sessions+=Math.max(1,(day.sessions||[]).length);}
      else if(isRestType(planForDate(data,date)))plannedRestDays++;
    }
    const prCount=computePRs(data).length,streak=calculateStreak(data);
    let xp=sessions*50+completedSets*2+prCount*15+Math.min(plannedRestDays,60)*5;
    if(streak>=7)xp+=50;if(streak>=30)xp+=150;if(streak>=100)xp+=400;
    xp=Math.round(xp);
    const level=Math.max(1,Math.floor(Math.sqrt(xp/175))+1);
    const floor=Math.pow(level-1,2)*175,next=Math.pow(level,2)*175;
    const ranks=['Starter','Builder','Consistent','Driven','Advanced','Relentless','Elite'];
    const rank=ranks[Math.min(ranks.length-1,Math.floor((level-1)/3))];
    return{xp,level,rank,floor,next,levelProgress:next===floor?100:clamp((xp-floor)/(next-floor)*100,0,100),completedSets,workoutDays,sessions,prCount,streak};
  }
  function weeklyMissions(data,endKey=localDateKey()){
    const keys=weekDateKeys(endKey).filter(key=>key<=endKey),targetDays=Math.min(3,clamp(data.profile?.trainingDays||3,1,7));
    const workoutDays=keys.filter(key=>getDay(data,key).workouts.length||getDay(data,key).sessions.length).length;
    const sets=keys.reduce((sum,key)=>sum+completedWorkingSetsForDay(data,key),0);
    const proteinDays=keys.filter(key=>nutritionTotals(getDay(data,key)).protein>=Number(data.proteinGoal||0)).length;
    const regions=new Set();keys.forEach(key=>getDay(data,key).workouts.forEach(w=>classifyExercise(w.name).primary.forEach(r=>regions.add(r))));
    return[
      {id:'workouts',title:'Complete planned sessions',progress:workoutDays,target:targetDays,reward:30,unit:'workouts'},
      {id:'sets',title:'Finish quality working sets',progress:sets,target:12,reward:25,unit:'sets'},
      {id:'protein',title:'Hit the protein target',progress:proteinDays,target:4,reward:25,unit:'days'},
      {id:'coverage',title:'Train different muscle regions',progress:regions.size,target:6,reward:20,unit:'regions'}
    ].map(item=>({...item,done:item.progress>=item.target,percent:clamp(item.progress/item.target*100,0,100)}));
  }
  function milestoneItems(data,progression){
    const values={first:progression.workoutDays,ten:progression.workoutDays,fifty:progression.workoutDays,sets:progression.completedSets,streak7:progression.streak,streak30:progression.streak};
    return[
      {id:'first',title:'First session',target:1,value:values.first},
      {id:'ten',title:'10 workout days',target:10,value:values.ten},
      {id:'fifty',title:'50 workout days',target:50,value:values.fifty},
      {id:'sets',title:'1,000 working sets',target:1000,value:values.sets},
      {id:'streak7',title:'7-day consistency',target:7,value:values.streak7},
      {id:'streak30',title:'30-day consistency',target:30,value:values.streak30}
    ].map(item=>({...item,done:item.value>=item.target,percent:clamp(item.value/item.target*100,0,100)}));
  }
  function comebackStatus(data){
    const dates=Object.keys(data.days||{}).filter(key=>key<=localDateKey()&&getDay(data,key).workouts.length).sort().reverse();
    if(!dates.length)return{active:true,days:null,message:'Your first session is enough. Start small and save one completed set.'};
    const days=Math.floor((dateFromKey(localDateKey())-dateFromKey(dates[0]))/86400000);
    return{active:days>=5,days,message:days>=5?`${days} days since your last workout. Resume with one normal session—no punishment and no catch-up volume.`:''};
  }

  function ProgressionStrip({data,onOpen}){
    if(data.gamification?.enabled===false)return null;
    const progress=progressionSummary(data);
    return html`<${Paper} className="xp-strip" variant="outlined" role=${onOpen?'button':undefined} tabIndex=${onOpen?0:undefined} onClick=${onOpen} onKeyDown=${onOpen?(e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen();}}):undefined}>
      <div className="xp-mark"><${Icon} name="bolt" fontSize="small"/></div>
      <div className="xp-copy"><${Typography} variant="caption" color="text.secondary">LEVEL ${progress.level} · ${progress.rank.toUpperCase()}</${Typography}><div className="xp-line"><span style=${{width:`${progress.levelProgress}%`}}></span></div></div>
      <${Typography} className="metric-number" variant="caption" fontWeight=${800}>${progress.xp} XP</${Typography}>
    </${Paper}>`;
  }

  function makeTheme(mode, highContrast=false){
    const dark=mode==='dark';
    const divider=dark?(highContrast?'rgba(255,255,255,.34)':'rgba(255,255,255,.14)'):(highContrast?'rgba(18,17,16,.34)':'rgba(18,17,16,.14)');
    return createTheme({
      palette:{
        mode,
        primary:{main:dark?'#FF7952':'#F0643E',contrastText:'#11100F'},
        secondary:{main:dark?'#B2A7FF':'#9F92F7',contrastText:'#11100F'},
        success:{main:dark?'#B8D45A':'#9FBE43',contrastText:'#11100F'},
        warning:{main:dark?'#F1D149':'#E7C52A',contrastText:'#11100F'},
        error:{main:dark?'#FF727A':'#F3575F'},
        background:{default:dark?'#1C1B1A':'#F1EEE9',paper:dark?'#262422':'#FBF9F6'},
        text:{primary:dark?'#F8F5F0':'#141311',secondary:dark?'#B6B0AA':'#69635E'},
        divider
      },
      shape:{borderRadius:12},
      typography:{
        fontFamily:'"Inter Tight",Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        fontSize:13,
        h4:{fontWeight:850,fontSize:'1.48rem',lineHeight:1.02,letterSpacing:'-.045em'},
        h5:{fontWeight:820,fontSize:'1.18rem',lineHeight:1.1,letterSpacing:'-.03em'},
        h6:{fontWeight:790,fontSize:'.98rem',lineHeight:1.15,letterSpacing:'-.02em'},
        body1:{fontSize:'.88rem',lineHeight:1.42},body2:{fontSize:'.79rem',lineHeight:1.42},caption:{fontSize:'.68rem',lineHeight:1.35},
        button:{fontWeight:760,fontSize:'.77rem',textTransform:'none',letterSpacing:'-.012em'}
      },
      components:{
        MuiCssBaseline:{styleOverrides:{body:{backgroundImage:'none'}}},
        MuiCard:{styleOverrides:{root:{border:`1px solid ${divider}`,boxShadow:'none',backgroundImage:'none'}}},
        MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}},
        MuiButton:{defaultProps:{disableElevation:true},styleOverrides:{root:{minHeight:35,borderRadius:10,paddingLeft:12,paddingRight:12},contained:{boxShadow:'none',backgroundColor:dark?'#F8F5F0':'#141311',color:dark?'#141311':'#F8F5F0','&:hover':{backgroundColor:dark?'#E8E3DD':'#2A2825'}}}},
        MuiIconButton:{styleOverrides:{root:{minWidth:35,minHeight:35,borderRadius:9}}},
        MuiTextField:{defaultProps:{variant:'outlined',size:'small'}},
        MuiOutlinedInput:{styleOverrides:{root:{borderRadius:10,minHeight:40,backgroundColor:dark?'rgba(255,255,255,.025)':'rgba(255,255,255,.34)'},input:{paddingTop:9,paddingBottom:9}}},
        MuiInputLabel:{styleOverrides:{root:{lineHeight:1.2,maxWidth:'calc(100% - 24px)'},shrink:{paddingLeft:3,paddingRight:3}}},
        MuiChip:{styleOverrides:{root:{fontWeight:720,height:25,borderRadius:9},label:{paddingLeft:8,paddingRight:8}}},
        MuiToggleButton:{styleOverrides:{root:{borderRadius:9,padding:'6px 10px',fontSize:12,fontWeight:780}}},
        MuiBottomNavigation:{styleOverrides:{root:{height:'calc(62px + env(safe-area-inset-bottom))',paddingBottom:'env(safe-area-inset-bottom)',backgroundColor:dark?'rgba(28,27,26,.97)':'rgba(251,249,246,.97)',backdropFilter:'blur(18px)',borderTop:`1px solid ${divider}`}}},
        MuiBottomNavigationAction:{styleOverrides:{root:{minWidth:0,padding:'7px 2px',fontSize:9.5},label:{fontSize:9.5,'&.Mui-selected':{fontSize:9.5,fontWeight:750}}}},
        MuiDialog:{styleOverrides:{paper:{borderRadius:16}}},
        MuiAlert:{styleOverrides:{root:{borderRadius:10}}}
      }
    });
  }

  function CardShell({children,sx={},className='',...props}){return html`<${Card} className=${`material-card ${className}`.trim()} sx=${{...sx}} ...${props}><${CardContent} sx=${{p:1.55,'&:last-child':{pb:1.55}}}>${children}</${CardContent}></${Card}>`;}
  function PageHeader({eyebrow,title,action}){return html`<${Box} sx=${{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:1.2,mb:1.35,flexWrap:'wrap'}}><${Box}><${Typography} variant="overline" color="text.secondary" sx=${{fontWeight:800,letterSpacing:1.05,lineHeight:1.2}}>${eyebrow}</${Typography}><${Typography} variant="h4">${title}</${Typography}></${Box}>${action||null}</${Box}>`;}
  function SectionHeading({title,subtitle,action}){return html`<${Box} sx=${{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:1,mb:.9}}><${Box} sx=${{minWidth:0}}><${Typography} variant="h6">${title}</${Typography}>${subtitle?html`<${Typography} variant="body2" color="text.secondary">${subtitle}</${Typography}>`:null}</${Box}>${action||null}</${Box}>`;}
  function InfoButton({term,onOpen}){return html`<${Tooltip} title=${`Explain ${term}`}><${IconButton} size="small" aria-label=${`Explain ${term}`} onClick=${()=>onOpen(term)}><${Icon} name="info" fontSize="small"/></${IconButton}></${Tooltip}>`;}
  function DateBar({value,onChange,label='Editing',sticky=true}){
    return html`<${Paper} className=${sticky?'date-strip date-strip-sticky':'date-strip'} elevation=${0} sx=${{display:'flex',alignItems:'center',gap:1,p:1,mb:1.8,bgcolor:'background.default',backgroundImage:'none'}}>
      <${IconButton} aria-label="Previous day" onClick=${()=>onChange(shiftDateKey(value,-1))}>‹</${IconButton}>
      <${Button} variant="outlined" startIcon=${html`<${Icon} name="calendar"/>`} sx=${{flex:1,justifyContent:'flex-start',minWidth:0}} component="label">
        <${Box} sx=${{minWidth:0,textAlign:'left'}}><${Typography} component="span" variant="caption" color="text.secondary" sx=${{display:'block',lineHeight:1}}>${label}</${Typography}><${Typography} component="span" variant="body2" fontWeight=${800} sx=${{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>${formatDate(value,{weekday:'long',month:'short',day:'numeric'})}</${Typography}></${Box}>
        <input className="sr-only" type="date" value=${value} max=${localDateKey()} onChange=${e=>e.target.value&&onChange(e.target.value)} />
      </${Button}>
      ${value!==localDateKey()?html`<${Button} size="small" onClick=${()=>onChange(localDateKey())}>Today</${Button}>`:null}
      <${IconButton} aria-label="Next day" disabled=${value>=localDateKey()} onClick=${()=>onChange(shiftDateKey(value,1))}>›</${IconButton}>
    </${Paper}>`;
  }
  function MiniSparkline({values=[]}){
    const nums=values.map(Number).filter(Number.isFinite); if(nums.length<2)return null;
    const w=104,h=24,p=2,min=Math.min(...nums),max=Math.max(...nums),range=Math.max(1,max-min);
    const points=nums.map((value,index)=>`${p+(w-p*2)*(index/(nums.length-1))},${h-p-(h-p*2)*((value-min)/range)}`).join(' ');
    return html`<svg className="mini-sparkline" viewBox=${`0 0 ${w} ${h}`} aria-hidden="true"><polyline points=${points}></polyline></svg>`;
  }
  function MetricCard({label,value,sub,progress,color='primary',trend=[],onClick}){
    const interactive=typeof onClick==='function';
    const tone=String(label||'metric').toLowerCase().replace(/[^a-z0-9]+/g,'-');
    return html`<${CardShell} className=${`metric-card metric-${tone}`} role=${interactive?'button':undefined} tabIndex=${interactive?0:undefined} onClick=${onClick} onKeyDown=${interactive?(event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onClick();}}):undefined} sx=${{height:'100%',cursor:interactive?'pointer':'default',transition:'transform .16s ease, border-color .16s ease','&:hover':interactive?{transform:'translateY(-1px)'}:{},'&:focus-visible':interactive?{outline:'3px solid',outlineColor:'text.primary',outlineOffset:2}:{}}}>
      <${Stack} direction="row" justifyContent="space-between" alignItems="flex-start" spacing=${1}><${Typography} variant="caption" color="text.secondary" fontWeight=${800}>${label}</${Typography}>${interactive?html`<${Typography} aria-hidden="true" color="text.secondary" sx=${{fontSize:18,lineHeight:1}}>›</${Typography}>`:null}</${Stack}>
      <${Typography} className="metric-number" variant="h5" sx=${{mt:.3}}>${value}</${Typography}>${sub?html`<${Typography} variant="caption" color="text.secondary" sx=${{display:'block',minHeight:'1.5em'}}>${sub}</${Typography}>`:null}
      ${trend?.length?html`<${Box} sx=${{mt:.7,color:color==='secondary'?'secondary.main':'primary.main'}}><${MiniSparkline} values=${trend}/></${Box}>`:null}
      ${Number.isFinite(progress)?html`<${LinearProgress} variant="determinate" value=${clamp(progress,0,100)} color=${color} sx=${{mt:trend?.length?.5:1.2,height:7,borderRadius:99}}/>`:null}
    </${CardShell}>`;
  }

  function useSetlineState(){
    const [data,setData]=useState(()=>loadState());
    const saveTimer=useRef(null);
    useEffect(()=>{clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>persistState(data),120);return()=>clearTimeout(saveTimer.current);},[data]);
    const update=useCallback(mutator=>setData(prev=>{const next=deepClone(prev);mutator(next);next.schemaVersion=9;next.updatedAt=new Date().toISOString();return next;}),[]);
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
    const color=mode==='dark'?'#080808':'#f7f7f5'; const tag=document.querySelector('meta[name="theme-color"]'); if(tag)tag.setAttribute('content',color);
  }

  const EQUIPMENT_OPTIONS = [
    {value:'commercial_gym',label:'Full gym',detail:'Machines, cables and free weights',emoji:'🏢'},
    {value:'barbell',label:'Barbell',detail:'Rack and plates',emoji:'🏋️'},
    {value:'dumbbells',label:'Dumbbells',detail:'Fixed or adjustable',emoji:'💪'},
    {value:'cables',label:'Cable machine',detail:'Adjustable pulley station',emoji:'↔️'},
    {value:'smith_machine',label:'Smith machine',detail:'Guided barbell',emoji:'▥'},
    {value:'plate_loaded',label:'Plate-loaded machines',detail:'Leverage machines',emoji:'⚙️'},
    {value:'selectorized',label:'Selectorized machines',detail:'Pin-loaded machines',emoji:'🎛️'},
    {value:'bench',label:'Bench',detail:'Flat or adjustable',emoji:'▬'},
    {value:'pullup_bar',label:'Pull-up bar',detail:'Pull-ups and hangs',emoji:'⌒'},
    {value:'resistance_bands',label:'Resistance bands',detail:'Portable resistance',emoji:'〰️'},
    {value:'kettlebells',label:'Kettlebells',detail:'Ballistic and strength work',emoji:'🔔'},
    {value:'bodyweight',label:'Bodyweight only',detail:'No equipment required',emoji:'🧍'}
  ];
  const AVOID_OPTIONS = [
    {value:'overhead_press',label:'Overhead pressing'},
    {value:'bench_press',label:'Bench pressing'},
    {value:'dips',label:'Dips'},
    {value:'pullups',label:'Pull-ups / chin-ups'},
    {value:'squats',label:'Squats'},
    {value:'lunges',label:'Lunges / split squats'},
    {value:'hip_hinge',label:'Deadlifts / hip hinges'},
    {value:'running',label:'Running'},
    {value:'jumping',label:'Jumping / impact'},
    {value:'spinal_loading',label:'Heavy spinal loading'}
  ];
  const SPLIT_OPTIONS = [
    {value:'full_body',label:'Full Body',days:'2–4 days',detail:'Train most major regions each session.'},
    {value:'upper_lower',label:'Upper / Lower',days:'3–4 days',detail:'Alternate upper- and lower-body sessions.'},
    {value:'push_pull_legs',label:'Push / Pull / Legs',days:'3 or 6 days',detail:'Group sessions by movement and muscle role.'},
    {value:'ppl_upper_lower',label:'PPL + Upper / Lower',days:'5 days',detail:'Focused PPL days plus broader Upper and Lower days.'},
    {value:'bro_split',label:'Bro Split',days:'5 days',detail:'Chest, Back, Shoulders, Arms and Legs days.'},
    {value:'custom',label:'Custom',days:'1–7 days',detail:'Start with generic workout days and edit the calendar.'}
  ];
  const PLAN_POSITIONS={1:[0],2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,4,5],6:[0,1,2,3,4,5],7:[0,1,2,3,4,5,6]};

  function splitInfo(value){return SPLIT_OPTIONS.find(option=>option.value===value)||SPLIT_OPTIONS[2];}
  function splitWarning(split,days){
    days=clamp(days,1,7);
    if(split==='ppl_upper_lower'&&days!==5)return 'PPL + Upper / Lower is designed for five training days. Setline will still create exactly the number you selected.';
    if(split==='bro_split'&&days!==5)return 'The Bro Split is most balanced with five days so every body-part day appears once.';
    if(split==='push_pull_legs'&&![3,6].includes(days))return 'PPL is most balanced at three or six days. With this selection, continue the sequence rather than forcing every region into one week.';
    if(split==='upper_lower'&&(days<3||days>4))return 'Upper / Lower usually works best across three or four days.';
    if(split==='full_body'&&(days<2||days>4))return 'Full Body usually works best across two to four days.';
    return '';
  }
  function generatePlan(split,days){
    const safeDays=clamp(Math.round(Number(days)||4),1,7);
    const cycles={
      push_pull_legs:['push','pull','legs'],
      upper_lower:['upper','lower'],
      full_body:['full_body'],
      ppl_upper_lower:['push','pull','legs','upper','lower'],
      bro_split:['chest','back','shoulders','arms','legs'],
      custom:['workout']
    };
    const cycle=cycles[split]||cycles.push_pull_legs;
    const plan=Array(7).fill('rest');
    (PLAN_POSITIONS[safeDays]||PLAN_POSITIONS[4]).forEach((position,index)=>{plan[position]=cycle[index%cycle.length];});
    return plan;
  }

  function SelectableCard({selected,onClick,title,detail,badge,emoji}){
    return html`<${Paper} component="button" type="button" onClick=${onClick} variant="outlined" className=${`setup-choice${selected?' selected':''}`} aria-pressed=${selected} sx=${{textAlign:'left',color:'text.primary',bgcolor:selected?'action.selected':'background.paper',borderColor:selected?'primary.main':'divider'}}><${Stack} direction="row" spacing=${1.2} alignItems="flex-start"><${Avatar} sx=${{width:38,height:38,bgcolor:selected?'primary.main':'action.hover',color:selected?'primary.contrastText':'text.primary',fontSize:18}}>${emoji||'✓'}</${Avatar}><${Box} sx=${{minWidth:0,flex:1}}><${Stack} direction="row" justifyContent="space-between" spacing=${1}><${Typography} fontWeight=${850}>${title}</${Typography}>${badge?html`<${Chip} label=${badge} size="small" variant=${selected?'filled':'outlined'} color=${selected?'primary':'default'}/>`:null}</${Stack}>${detail?html`<${Typography} variant="caption" color="text.secondary" sx=${{display:'block',mt:.35,lineHeight:1.45}}>${detail}</${Typography}>`:null}</${Box}></${Stack}></${Paper}>`;
  }

  function OnboardingDialog({open,data,update,onClose}){
    const fullScreen=useMediaQuery(theme=>theme.breakpoints.down('sm'));
    const [step,setStep]=useState(0);
    const [draft,setDraft]=useState(()=>deepClone(data.profile));
    const [themeMode,setThemeMode]=useState(data.settings.theme||'system');
    const [unitMode,setUnitMode]=useState(data.preferredUnit||'kg');
    useEffect(()=>{if(open){const next=deepClone(data.profile);next.trainingDays=clamp(next.trainingDays??4,1,7);next.equipment=Array.isArray(next.equipment)?next.equipment:[];next.avoidMovements=Array.isArray(next.avoidMovements)?next.avoidMovements:[];setDraft(next);setThemeMode(data.settings.theme||'system');setUnitMode(data.preferredUnit||'kg');setStep(0);}},[open]);
    const steps=['Goal','Experience','Training days','Split','Equipment','Avoid','Preview','Appearance'];
    const trainingDays=clamp(draft.trainingDays??4,1,7);
    const previewPlan=generatePlan(draft.split||'push_pull_legs',trainingDays);
    const warning=splitWarning(draft.split||'push_pull_legs',trainingDays);
    const toggleEquipment=value=>setDraft(current=>{const items=new Set(current.equipment||[]);items.has(value)?items.delete(value):items.add(value);return{...current,equipment:[...items]};});
    const toggleAvoid=value=>setDraft(current=>{const items=new Set(current.avoidMovements||[]);items.has(value)?items.delete(value):items.add(value);return{...current,avoidMovements:[...items]};});
    const finish=()=>{const safeDays=clamp(draft.trainingDays??4,1,7);update(next=>{const equipment=Array.isArray(draft.equipment)?draft.equipment:[];const avoidMovements=Array.isArray(draft.avoidMovements)?draft.avoidMovements:[];next.profile={...next.profile,...draft,trainingDays:safeDays,equipment,avoidMovements,avoid:avoidMovements.join(', '),avoidNote:draft.avoidNote||''};next.settings.theme=themeMode;next.preferredUnit=normalizeUnit(unitMode);next.weeklyPlan=generatePlan(draft.split,safeDays);next.scheduleMeta.configured=true;next.onboardingComplete=true;});onClose();};
    return html`<${Dialog} open=${open} fullScreen=${fullScreen} maxWidth="md" fullWidth onClose=${onClose} PaperProps=${{className:'setup-dialog'}}>
      <${DialogTitle} sx=${{pb:1}}><${Stack} direction="row" alignItems="center" justifyContent="space-between" spacing=${2}><${Box}><${Typography} variant="overline" color="primary.main" fontWeight=${900}>SETLINE 7</${Typography}><${Typography} variant="h5">Run Setup</${Typography}></${Box}><${IconButton} onClick=${onClose} aria-label="Close setup"><${Icon} name="close"/></${IconButton}></${Stack}></${DialogTitle}>
      <${DialogContent} dividers>
        <${Box} sx=${{mb:2.5}}><${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{mb:.7}}><${Typography} variant="body2" fontWeight=${850}>${steps[step]}</${Typography}><${Typography} variant="caption" color="text.secondary">Step ${step+1} of ${steps.length}</${Typography}></${Stack}><${LinearProgress} variant="determinate" value=${((step+1)/steps.length)*100} sx=${{height:7,borderRadius:99}}/></${Box}>
        <div className="setup-step" key=${step}>
          ${step===0?html`<${Stack} spacing=${2}><${TextField} label="Your name" value=${draft.name||''} onChange=${e=>setDraft({...draft,name:e.target.value})}/><${Typography} fontWeight=${800}>Primary goal</${Typography}><div className="setup-choice-grid">${[
            ['build_muscle','Build muscle','Prioritize hypertrophy and weekly region coverage','💪'],['strength','Build strength','Track progressive loading and personal records','🏋️'],['fat_loss','Fat loss','Combine resistance training with nutrition targets','⚡'],['general','General fitness','Build consistency, strength and health','🌱']
          ].map(([value,title,detail,emoji])=>html`<${SelectableCard} key=${value} selected=${draft.goal===value} onClick=${()=>setDraft({...draft,goal:value})} title=${title} detail=${detail} emoji=${emoji}/>` )}</div></${Stack}>`:null}
          ${step===1?html`<${Stack} spacing=${2}><${Typography} fontWeight=${800}>Training experience</${Typography}><div className="setup-choice-grid">${[
            ['beginner','Beginner','Still building technique and consistency','1'],['intermediate','Intermediate','Comfortable with major exercises and progression','2'],['advanced','Advanced','Experienced with programming and fatigue management','3']
          ].map(([value,title,detail,emoji])=>html`<${SelectableCard} key=${value} selected=${draft.experience===value} onClick=${()=>setDraft({...draft,experience:value})} title=${title} detail=${detail} emoji=${emoji}/>` )}</div></${Stack}>`:null}
          ${step===2?html`<${Stack} spacing=${2}><${Box}><${Typography} variant="h6">How many days can you train?</${Typography}><${Typography} variant="body2" color="text.secondary">This value is saved separately from the seven-day calendar and will not reset itself.</${Typography}></${Box}><div className="training-days-grid">${[1,2,3,4,5,6,7].map(day=>html`<${Button} key=${day} className=${trainingDays===day?'selected':''} variant=${trainingDays===day?'contained':'outlined'} onClick=${()=>setDraft({...draft,trainingDays:day})}><span>${day}</span><small>${day===1?'day':'days'}</small></${Button}>`)}</div><${Alert} severity="info">Selected: <b>${trainingDays} training day${trainingDays===1?'':'s'} per week</b>.</${Alert}></${Stack}>`:null}
          ${step===3?html`<${Stack} spacing=${1.2}><${Box}><${Typography} variant="h6">Preferred training split</${Typography}><${Typography} variant="body2" color="text.secondary">You can edit any individual day later without changing workout history.</${Typography}></${Box}><div className="setup-choice-grid">${SPLIT_OPTIONS.map(option=>html`<${SelectableCard} key=${option.value} selected=${draft.split===option.value} onClick=${()=>setDraft({...draft,split:option.value})} title=${option.label} detail=${option.detail} badge=${option.days}/>` )}</div>${warning?html`<${Alert} severity="warning">${warning}</${Alert}>`:null}</${Stack}>`:null}
          ${step===4?html`<${Stack} spacing=${1.5}><${Box}><${Typography} variant="h6">Available equipment</${Typography}><${Typography} variant="body2" color="text.secondary">Select everything you can reliably use. Setline will use this for substitutions and starter plans.</${Typography}></${Box}><div className="setup-choice-grid equipment-grid">${EQUIPMENT_OPTIONS.map(option=>html`<${SelectableCard} key=${option.value} selected=${(draft.equipment||[]).includes(option.value)} onClick=${()=>toggleEquipment(option.value)} title=${option.label} detail=${option.detail} emoji=${option.emoji}/>` )}</div>${!(draft.equipment||[]).length?html`<${Alert} severity="info">No equipment selected. Bodyweight suggestions will remain available.</${Alert}>`:null}</${Stack}>`:null}
          ${step===5?html`<${Stack} spacing=${1.5}><${Box}><${Typography} variant="h6">Movements to avoid</${Typography}><${Typography} variant="body2" color="text.secondary">Optional. Select movements you do not want Setline to suggest. This is not medical screening.</${Typography}></${Box}><${Box} sx=${{display:'flex',gap:.8,flexWrap:'wrap'}}>${AVOID_OPTIONS.map(option=>html`<${Chip} key=${option.value} clickable label=${option.label} color=${(draft.avoidMovements||[]).includes(option.value)?'error':'default'} variant=${(draft.avoidMovements||[]).includes(option.value)?'filled':'outlined'} onClick=${()=>toggleAvoid(option.value)} />`)}</${Box}><${TextField} label="Optional note" placeholder="Example: left shoulder discomfort during overhead pressing" value=${draft.avoidNote||''} onChange=${e=>setDraft({...draft,avoidNote:e.target.value})} multiline minRows=${2}/>${!(draft.avoidMovements||[]).length?html`<${Alert} severity="success">No movements selected to avoid.</${Alert}>`:null}</${Stack}>`:null}
          ${step===6?html`<${Stack} spacing=${1.5}><${Box}><${Typography} variant="h6">Your weekly preview</${Typography}><${Typography} variant="body2" color="text.secondary">${splitInfo(draft.split).label} · ${trainingDays} training day${trainingDays===1?'':'s'}</${Typography}></${Box}>${warning?html`<${Alert} severity="warning">${warning}</${Alert}>`:null}<${Paper} variant="outlined" className="schedule-preview"><${Stack} spacing=${.6}>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day,index)=>html`<${Stack} key=${day} direction="row" alignItems="center" justifyContent="space-between" sx=${{p:1,borderRadius:2,bgcolor:isRestType(previewPlan[index])?'transparent':'action.selected'}}><${Typography} variant="body2" fontWeight=${750}>${day}</${Typography}><${Chip} label=${planLabel(previewPlan[index])} size="small" color=${isRestType(previewPlan[index])?'default':'primary'} variant=${isRestType(previewPlan[index])?'outlined':'filled'}/></${Stack}>`)}</${Stack}></${Paper}><${Alert} severity="info">Finishing setup updates the plan only. Existing workouts, meals, bodyweight and history remain untouched.</${Alert}></${Stack}>`:null}
          ${step===7?html`<${Stack} spacing=${2}><${Box}><${Typography} variant="h6">Appearance and default units</${Typography}><${Typography} variant="body2" color="text.secondary">Choose your theme and the default unit for new exercises. Individual machines can still use a different unit.</${Typography}></${Box}><${ToggleButtonGroup} exclusive fullWidth value=${themeMode} onChange=${(_,value)=>value&&setThemeMode(value)}><${ToggleButton} value="light">Light</${ToggleButton}><${ToggleButton} value="dark">Dark</${ToggleButton}><${ToggleButton} value="system">System</${ToggleButton}></${ToggleButtonGroup}><${ToggleButtonGroup} exclusive fullWidth value=${unitMode} onChange=${(_,value)=>value&&setUnitMode(value)}><${ToggleButton} value="kg">Default kg</${ToggleButton}><${ToggleButton} value="lb">Default lb</${ToggleButton}></${ToggleButtonGroup}><${Alert} severity="info">This default affects new exercises and chart display only. Each exercise remembers its own kg or lb setting.</${Alert}><${Paper} variant="outlined" sx=${{p:2,borderRadius:3}}><${Typography} fontWeight=${850}>Ready to build your plan</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.5}}>${splitInfo(draft.split).label}, ${trainingDays} day${trainingDays===1?'':'s'}, ${(draft.equipment||[]).length} equipment option${(draft.equipment||[]).length===1?'':'s'}, default ${unitMode}.</${Typography}></${Paper}></${Stack}>`:null}
        </div>
      </${DialogContent}>
      <${DialogActions} sx=${{px:2.5,py:1.5}}><${Button} onClick=${onClose}>Skip</${Button}><${Box} sx=${{flex:1}}/>${step>0?html`<${Button} onClick=${()=>setStep(value=>value-1)}>Back</${Button}>`:null}<${Button} variant="contained" onClick=${()=>step<steps.length-1?setStep(value=>value+1):finish()}>${step<steps.length-1?'Continue':'Finish setup'}</${Button}></${DialogActions}>
    </${Dialog}>`;
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
  function planLabel(type){return({push:'Push',pull:'Pull',legs:'Legs',upper:'Upper',lower:'Lower',full_body:'Full body',chest:'Chest',back:'Back',shoulders:'Shoulders',arms:'Arms',workout:'Workout',rest:'Rest day',active_recovery:'Active recovery',deload:'Deload'})[type]||String(type||'Rest').replaceAll('_',' ');}
  function statusColor(status){return status==='good'?'success.main':status==='high'?'warning.main':status==='low'?'secondary.main':'error.main';}
  function regionHex(status){return status==='good'?'#43D69E':status==='high'?'#FFB547':status==='low'?'#FFB547':'#FF7082';}
  function weightDisplay(data,kg){if(!Number.isFinite(Number(kg))||Number(kg)<=0)return '—';return data.preferredUnit==='lb'?round1(Number(kg)*2.20462)+' lb':round1(kg)+' kg';}

  const STREAK_QUOTES = [
    {text:'No longer talk at all about the kind of man that a good man ought to be, but be such.',author:'Marcus Aurelius'},
    {text:'No man is free who is not master of himself.',author:'Epictetus'},
    {text:'Difficulties strengthen the mind, as well as labor does the body.',author:'Seneca'},
    {text:'A ship should not ride on a single anchor, nor life on a single hope.',author:'Epictetus'},
    {text:'Choose the life that is noblest, for custom can make it sweet to thee.',author:'Epictetus'},
    {text:'All things are change, yet we need not fear anything new.',author:'Marcus Aurelius'}
  ];
  const HOME_CARD_LABELS={calories:'Calories',protein:'Protein',readiness:'Readiness',bodyweight:'Bodyweight'};

  function MetricDetailSheet({type,open,onClose,data,update,navigate,showFeedback}){
    const today=localDateKey(),day=getDay(data,today),totals=nutritionTotals(day),ready=readiness(data.recovery?.[today]);
    const recovery=data.recovery?.[today]||{};
    const recentWeights=Object.entries(data.bodyWeights||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-7);
    const copyYesterday=()=>{const previous=getDay(data,shiftDateKey(today,-1)).calories;if(!previous.length){showFeedback('No food found yesterday');return;}update(next=>{const target=ensureDayMutable(next,today);target.calories.push(...previous.map(item=>({...deepClone(item),id:id('food'),loggedAt:new Date().toISOString()})));});showFeedback('Yesterday copied');onClose();};
    const quickProtein=()=>{const raw=prompt('Protein to add (grams):','25');if(raw===null)return;const protein=Number(raw);if(!Number.isFinite(protein)||protein<=0)return;update(next=>ensureDayMutable(next,today).calories.push({id:id('food'),name:'Quick protein',meal:'Snack',kcal:Math.round(protein*4),protein:round1(protein),carbs:0,fat:0,amount:1,unit:'entry',loggedAt:new Date().toISOString()}));showFeedback('Protein added');onClose();};
    const logWeight=()=>{const current=data.bodyWeights?.[today]||data.bodyWeightKg||'';const shown=data.preferredUnit==='lb'&&current?round1(current*2.20462):current;const raw=prompt(`Bodyweight in ${data.preferredUnit}:`,String(shown));if(raw===null)return;let value=Number(raw);if(!Number.isFinite(value)||value<=0)return;if(data.preferredUnit==='lb')value/=2.20462;update(next=>{next.bodyWeights[today]=round1(value);next.bodyWeightKg=round1(value);});showFeedback('Bodyweight saved');onClose();};
    const title=HOME_CARD_LABELS[type]||'Details';
    return html`<${Drawer} anchor="bottom" open=${open} onClose=${onClose} PaperProps=${{sx:{borderTopLeftRadius:26,borderTopRightRadius:26,maxHeight:'82dvh',pb:'calc(14px + env(safe-area-inset-bottom))'}}}>
      <${Box} sx=${{width:'min(100%,680px)',mx:'auto',p:2.2,overflow:'auto'}}>
        <${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{mb:1.5}}><${Box}><${Typography} variant="overline" color="text.secondary" fontWeight=${800}>TODAY</${Typography}><${Typography} variant="h5">${title}</${Typography}></${Box}><${IconButton} onClick=${onClose}><${Icon} name="close"/></${IconButton}></${Stack}>
        ${type==='calories'?html`<${Stack} spacing=${1.4}><${Alert} severity=${totals.kcal>data.calorieGoal?'warning':'info'}>${Math.round(totals.kcal)} of ${data.calorieGoal} kcal · ${Math.max(0,Math.round(data.calorieGoal-totals.kcal))} remaining</${Alert}>${day.calories.length?html`<${Stack} spacing=${.8}>${day.calories.slice(-5).reverse().map(item=>html`<${Paper} key=${item.id} variant="outlined" sx=${{p:1.2,borderRadius:2,display:'flex',justifyContent:'space-between',gap:1.5}}><${Typography} className="food-name" variant="body2" fontWeight=${700}>${item.name}</${Typography}><${Typography} variant="body2" color="secondary.main" fontWeight=${800} sx=${{whiteSpace:'nowrap'}}>${Math.round(item.kcal||0)} kcal</${Typography}></${Paper}>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">No food logged today.</${Typography}>`}<${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1}><${Button} variant="contained" color="secondary" onClick=${()=>{onClose();navigate('nutrition');}}>Add food</${Button}><${Button} variant="outlined" onClick=${copyYesterday}>Copy yesterday</${Button}><${Button} onClick=${()=>{onClose();navigate('nutrition');}}>View nutrition</${Button}></${Stack}></${Stack}>`:null}
        ${type==='protein'?html`<${Stack} spacing=${1.4}><${Alert} severity=${totals.protein>=data.proteinGoal?'success':'info'}>${Math.round(totals.protein)} of ${data.proteinGoal} g · ${Math.max(0,Math.round(data.proteinGoal-totals.protein))} g remaining</${Alert}>${day.calories.filter(x=>Number(x.protein)>0).sort((a,b)=>Number(b.protein)-Number(a.protein)).slice(0,5).map(item=>html`<${Paper} key=${item.id} variant="outlined" sx=${{p:1.2,borderRadius:2,display:'flex',justifyContent:'space-between',gap:1.5}}><${Typography} className="food-name" variant="body2" fontWeight=${700}>${item.name}</${Typography}><${Typography} variant="body2" color="primary.main" fontWeight=${800} sx=${{whiteSpace:'nowrap'}}>${round1(item.protein)} g</${Typography}></${Paper}>`)}<${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1}><${Button} variant="contained" onClick=${quickProtein}>Quick-add protein</${Button}><${Button} variant="outlined" onClick=${()=>{onClose();navigate('nutrition');}}>Open nutrition</${Button}></${Stack}></${Stack}>`:null}
        ${type==='readiness'?html`<${Stack} spacing=${1.4}>${ready?html`<${Alert} severity=${ready.tone}><b>${ready.score} · ${ready.label}</b><br/>${ready.message}</${Alert}><${Box} sx=${{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1}}>${[['Sleep',recovery.sleep?`${recovery.sleep} h`:'—'],['Soreness',recovery.soreness||'—'],['Energy',recovery.energy||'—'],['Stress',recovery.stress||'—']].map(([label,value])=>html`<${Paper} key=${label} variant="outlined" sx=${{p:1.3,borderRadius:2}}><${Typography} variant="caption" color="text.secondary">${label}</${Typography}><${Typography} variant="h6">${value}</${Typography}></${Paper}>`)}</${Box}>`:html`<${Alert} severity="info">Complete today’s recovery check-in to calculate readiness.</${Alert}>`}<${Button} variant="contained" onClick=${()=>{onClose();navigate('profile');}}>Open recovery check-in</${Button}></${Stack}>`:null}
        ${type==='bodyweight'?html`<${Stack} spacing=${1.4}><${Alert} severity="info">Latest: ${weightDisplay(data,data.bodyWeights?.[today]||data.bodyWeightKg)}</${Alert}>${recentWeights.length?html`<${SimpleLineChart} values=${recentWeights.map(([,v])=>data.preferredUnit==='lb'?round1(Number(v)*2.20462):Number(v))} labels=${recentWeights.map(([key])=>formatDate(key,{month:'numeric',day:'numeric'}))} color="secondary.main" unit=${data.preferredUnit}/>`:html`<${Typography} variant="body2" color="text.secondary">Log weight to start a trend.</${Typography}>`}<${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1}><${Button} variant="contained" onClick=${logWeight}>Log bodyweight</${Button}><${Button} variant="outlined" onClick=${()=>{onClose();navigate('progress');}}>Open progress</${Button}></${Stack}></${Stack}>`:null}
      </${Box}>
    </${Drawer}>`;
  }

  function HomeCustomizeDialog({open,onClose,data,update}){
    const fallback=['calories','protein','readiness','bodyweight'];
    const order=(data.settings.homeCardOrder||fallback).filter(x=>fallback.includes(x));
    for(const key of fallback)if(!order.includes(key))order.push(key);
    const hidden=new Set(data.settings.hiddenHomeCards||[]);
    const move=(index,amount)=>{const nextIndex=index+amount;if(nextIndex<0||nextIndex>=order.length)return;const nextOrder=[...order];[nextOrder[index],nextOrder[nextIndex]]=[nextOrder[nextIndex],nextOrder[index]];update(next=>next.settings.homeCardOrder=nextOrder);};
    const toggle=key=>update(next=>{const current=new Set(next.settings.hiddenHomeCards||[]);if(current.has(key))current.delete(key);else if(current.size<order.length-1)current.add(key);next.settings.hiddenHomeCards=[...current];});
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="xs" fullWidth><${DialogTitle}>Customize Home cards</${DialogTitle}><${DialogContent} dividers><${Stack} spacing=${1}>${order.map((key,index)=>html`<${Paper} key=${key} variant="outlined" sx=${{p:1,pl:1.5,borderRadius:2,display:'flex',alignItems:'center',gap:1}}><${Box} sx=${{flex:1}}><${Typography} fontWeight=${800}>${HOME_CARD_LABELS[key]}</${Typography}><${Typography} variant="caption" color="text.secondary">${hidden.has(key)?'Hidden':'Visible'}</${Typography}></${Box}><${Switch} checked=${!hidden.has(key)} onChange=${()=>toggle(key)} inputProps=${{'aria-label':`Show ${HOME_CARD_LABELS[key]}`}}/><${IconButton} disabled=${index===0} onClick=${()=>move(index,-1)} aria-label="Move up">↑</${IconButton}><${IconButton} disabled=${index===order.length-1} onClick=${()=>move(index,1)} aria-label="Move down">↓</${IconButton}></${Paper}>`)}</${Stack}></${DialogContent}><${DialogActions}><${Button} onClick=${onClose}>Done</${Button}></${DialogActions}></${Dialog}>`;
  }

  function StreakEasterEgg({quote,open,onClose,streak}){
    const item=quote||STREAK_QUOTES[0];
    return html`<${Drawer} anchor="bottom" open=${open} onClose=${onClose} PaperProps=${{sx:{borderTopLeftRadius:28,borderTopRightRadius:28,pb:'calc(16px + env(safe-area-inset-bottom))'}}}><${Box} sx=${{width:'min(100%,620px)',mx:'auto',p:2.5,textAlign:'center'}}><div className="easter-flame flame-stage" aria-hidden="true"><span className="flame-glow"></span><span className="flame-main">🔥</span><span className="flame-spark one">✦</span><span className="flame-spark two">•</span></div><${Typography} variant="overline" color="secondary.main" fontWeight=${900}>${streak} DAY STREAK</${Typography}><${Typography} variant="h6" sx=${{mt:1,lineHeight:1.45}}>“${item.text}”</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{display:'block',mt:1.2,fontWeight:750}}>— ${item.author}</${Typography}><${Button} sx=${{mt:2}} onClick=${onClose}>Keep going</${Button}></${Box}></${Drawer}>`;
  }

  function HomePage({data,update,navigate,openGuide,showFeedback}){
    const today=localDateKey(),day=getDay(data,today),totals=nutritionTotals(day),streak=calculateStreak(data),plan=planForDate(data,today),ready=readiness(data.recovery?.[today]),report=regionReport(data,today),priority=report.priorities[0];
    const comeback=comebackStatus(data);
    const [metricSheet,setMetricSheet]=useState(''); const [customizeOpen,setCustomizeOpen]=useState(false); const [quote,setQuote]=useState(STREAK_QUOTES[0]); const [quoteOpen,setQuoteOpen]=useState(false); const lastQuote=useRef(-1);
    const firstName=(data.profile?.name||'').trim().split(/\s+/)[0];
    const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening';
    const todayWeight=data.bodyWeights?.[today]||data.bodyWeightKg;
    const trendDates=Array.from({length:7},(_,i)=>shiftDateKey(today,-(6-i)));
    const trends={
      calories:trendDates.map(key=>nutritionTotals(getDay(data,key)).kcal),
      protein:trendDates.map(key=>nutritionTotals(getDay(data,key)).protein),
      readiness:trendDates.map(key=>readiness(data.recovery?.[key])?.score||0),
      bodyweight:trendDates.map(key=>Number(data.bodyWeights?.[key]||0)).filter(Boolean)
    };
    const openQuote=()=>{let index=Math.floor(Math.random()*STREAK_QUOTES.length);if(STREAK_QUOTES.length>1&&index===lastQuote.current)index=(index+1)%STREAK_QUOTES.length;lastQuote.current=index;setQuote(STREAK_QUOTES[index]);setQuoteOpen(true);};
    const order=(data.settings.homeCardOrder||['calories','protein','readiness','bodyweight']); const hidden=new Set(data.settings.hiddenHomeCards||[]);
    const cardMap={
      calories:html`<${MetricCard} label="CALORIES" value=${Math.round(totals.kcal)} sub=${`${Math.max(0,data.calorieGoal-totals.kcal)} remaining`} progress=${totals.kcal/data.calorieGoal*100} color="secondary" trend=${trends.calories} onClick=${()=>setMetricSheet('calories')}/>` ,
      protein:html`<${MetricCard} label="PROTEIN" value=${`${Math.round(totals.protein)} g`} sub=${`${Math.max(0,data.proteinGoal-totals.protein)} g remaining`} progress=${totals.protein/data.proteinGoal*100} trend=${trends.protein} onClick=${()=>setMetricSheet('protein')}/>` ,
      readiness:html`<${MetricCard} label="READINESS" value=${ready?ready.score:'—'} sub=${ready?ready.label:'Check in first'} progress=${ready?.score} trend=${trends.readiness} onClick=${()=>setMetricSheet('readiness')}/>` ,
      bodyweight:html`<${MetricCard} label="BODYWEIGHT" value=${weightDisplay(data,todayWeight)} sub="Latest entry" trend=${trends.bodyweight} onClick=${()=>setMetricSheet('bodyweight')}/>`
    };
    const visibleOrder=order.filter(key=>cardMap[key]&&!hidden.has(key));
    return html`<div className="page-wrap home-page">
      <${Box} sx=${{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,mb:2}}>
        <${Stack} direction="row" spacing=${1.4} alignItems="center" sx=${{minWidth:0}}><${Avatar} src="./setline-s.svg" variant="rounded" sx=${{width:48,height:48,bgcolor:'primary.main'}}/><${Box} sx=${{minWidth:0}}><${Typography} variant="caption" color="text.secondary" fontWeight=${700}>${greeting}${firstName?`, ${firstName}`:''}</${Typography}><${Typography} variant="h4">Setline</${Typography}></${Box}></${Stack}>
        <${Chip} clickable onClick=${openQuote} aria-label="Open streak Easter egg" icon=${html`<span className=${`streak-flame streak-level-${streak>=100?4:streak>=30?3:streak>=7?2:streak>0?1:0}`} aria-hidden="true"><span>🔥</span></span>`} label=${`${streak} day${streak===1?'':'s'}`} color="warning" variant="outlined"/>
      </${Box}>
      <${ProgressionStrip} data=${data} onOpen=${()=>navigate('progress')}/>
      ${comeback.active?html`<${Paper} className="comeback-strip" variant="outlined"><${Icon} name="spark" color="primary"/><div><${Typography} fontWeight=${800}>${comeback.days===null?'Start your Setline':'Comeback mode'}</${Typography}><${Typography} variant="caption" color="text.secondary">${comeback.message}</${Typography}></div><${Button} size="small" onClick=${()=>navigate('workout')}>Train</${Button}></${Paper}>`:null}

      <${CardShell} className="today-plan" sx=${{mb:1.5}}>
        <${Stack} direction="row" justifyContent="space-between" alignItems="flex-start" spacing=${2}>
          <${Box}><${Typography} variant="overline" color="primary.main" fontWeight=${800}>TODAY'S PLAN</${Typography}><${Typography} variant="h5">${planLabel(plan)}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.5}}>${isRestType(plan)?'Recovery is part of the program. Planned rest keeps your schedule streak intact.':day.workouts.length?`${day.workouts.length} exercise${day.workouts.length===1?'':'s'} logged so far.`:'Previous performance will be prefilled when you add exercises.'}</${Typography}></${Box}>
          <${Avatar} sx=${{bgcolor:isRestType(plan)?'secondary.main':'primary.main',color:'#fff'}}><${Icon} name=${isRestType(plan)?'rest':'workout'}/></${Avatar}>
        </${Stack}>
        <${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1} sx=${{mt:2}}><${Button} variant="contained" startIcon=${html`<${Icon} name=${isRestType(plan)?'rest':'workout'}/>`} onClick=${()=>navigate('workout')}>${isRestType(plan)?'View recovery day':'Open workout'}</${Button}><${Button} variant="outlined" onClick=${()=>navigate('nutrition')}>Log nutrition</${Button}></${Stack}>
      </${CardShell}>

      <${Stack} direction="row" justifyContent="space-between" alignItems="center" sx=${{mb:1}}><${Typography} variant="caption" color="text.secondary" fontWeight=${800}>TAP A CARD FOR DETAILS</${Typography}><${Button} size="small" onClick=${()=>setCustomizeOpen(true)}>Customize</${Button}></${Stack}>
      <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(4,1fr)'},gap:1.3,mb:2}}>${visibleOrder.map(key=>html`<${React.Fragment} key=${key}>${cardMap[key]}</${React.Fragment}>`)}</${Box}>

      <div className="desktop-grid">
        <${Stack} spacing=${2.25}>
          <${CardShell} className="home-focus-tile">
            <${SectionHeading} title="Weekly focus" subtitle="Explainable muscle-region coverage" action=${html`<${Button} size="small" onClick=${()=>navigate('progress')}>View report</${Button}>`}/>
            ${report.workingSets<4?html`<${Alert} severity="info">Log a few working sets to unlock a useful weekly focus.</${Alert}>`:priority?html`<${Box}><${Stack} direction="row" justifyContent="space-between" alignItems="center"><${Box}><${Typography} variant="h6">Prioritize ${priority.label}</${Typography}><${Typography} variant="body2" color="text.secondary">${priority.value} of ${priority.target} target effective sets in the last 7 days.</${Typography}></${Box}><${Chip} label=${priority.status.toUpperCase()} color=${priority.status==='missed'?'error':'warning'} size="small"/></${Stack}><${Typography} variant="body2" sx=${{mt:1.4}}>Consider ${REGION_SUGGESTIONS[priority.key]?.slice(0,2).join(' or ')} when this region fits your next session.</${Typography}><${Button} size="small" sx=${{mt:1}} startIcon=${html`<${Icon} name="info"/>`} onClick=${()=>openGuide('Working set')}>How coverage is counted</${Button}></${Box}>`:html`<${Alert} severity="success">Your major regions have reasonable coverage. Progress the exercises already working.</${Alert}>`}
          </${CardShell}>

          <${CardShell} className="home-quick-tile">
            <${SectionHeading} title="Quick actions"/>
            <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(4,1fr)'},gap:1}}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>navigate('workout')}>Exercise</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="nutrition"/>`} onClick=${()=>navigate('nutrition')}>Food</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="progress"/>`} onClick=${()=>navigate('progress')}>Progress</${Button}>
              <${Button} variant="outlined" startIcon=${html`<${Icon} name="book"/>`} onClick=${()=>openGuide()}>Guide</${Button}>
            </${Box}>
          </${CardShell}>
        </${Stack}>

        <${Stack} spacing=${2.25}>
          <${CardShell} className="home-recovery-tile">
            <${SectionHeading} title="Recovery" subtitle=${formatDate(today,{weekday:'long',month:'short',day:'numeric'})}/>
            ${ready?html`<${Box}><${Stack} direction="row" spacing=${2} alignItems="center"><${Box} sx=${{position:'relative',display:'inline-flex'}}><${CircularProgress} variant="determinate" value=${ready.score} size=${72} thickness=${5} color=${ready.tone}/><${Box} sx=${{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><${Typography} fontWeight=${800}>${ready.score}</${Typography}></${Box}></${Box}><${Box}><${Typography} variant="h6">${ready.label}</${Typography}><${Typography} variant="body2" color="text.secondary">${ready.message}</${Typography}></${Box}></${Stack}></${Box}>`:html`<${Alert} severity="info" action=${html`<${Button} color="inherit" size="small" onClick=${()=>navigate('profile')}>Check in</${Button}>`}>Add sleep, soreness, energy and stress to get recovery guidance.</${Alert}>`}
          </${CardShell}>

          <${CardShell} className="home-week-tile">
            <${SectionHeading} title="This week" subtitle="Planned schedule"/>
            <${Stack} spacing=${.8}>${data.weeklyPlan.map((type,index)=>{const key=shiftDateKey(mondayOf(today),index),current=key===today,logged=getDay(data,key).workouts.length>0;return html`<${Stack} key=${key} direction="row" alignItems="center" justifyContent="space-between" sx=${{p:1,borderRadius:2,bgcolor:current?'action.selected':'transparent'}}><${Stack} direction="row" spacing=${1} alignItems="center"><${Avatar} sx=${{width:28,height:28,fontSize:12,bgcolor:logged?'success.main':isRestType(type)?'secondary.main':'primary.main'}}>${logged?'✓':formatDate(key,{weekday:'narrow'})}</${Avatar}><${Typography} variant="body2" fontWeight=${current?800:600}>${formatDate(key,{weekday:'short'})}</${Typography}></${Stack}><${Typography} variant="body2" color="text.secondary">${planLabel(type)}</${Typography}></${Stack}>`;})}</${Stack}>
          </${CardShell}>
        </${Stack}>
      </div>
      <${MetricDetailSheet} type=${metricSheet} open=${!!metricSheet} onClose=${()=>setMetricSheet('')} data=${data} update=${update} navigate=${navigate} showFeedback=${showFeedback}/>
      <${HomeCustomizeDialog} open=${customizeOpen} onClose=${()=>setCustomizeOpen(false)} data=${data} update=${update}/>
      <${StreakEasterEgg} quote=${quote} open=${quoteOpen} onClose=${()=>setQuoteOpen(false)} streak=${streak}/>
    </div>`;
  }

  const COMMON_EXERCISES=['Incline Dumbbell Press','Chest Press','Cable Fly','Shoulder Press','Cable Lateral Raise','Rear Delt Fly','Rope Triceps Pushdown','Overhead Triceps Extension','Lat Pulldown','Seated Cable Row','Chest-Supported Row','Face Pull','Preacher Curl','Hammer Curl','Hack Squat','Leg Press','Romanian Deadlift','Leg Curl','Leg Extension','Hip Thrust','Calf Raise','Cable Crunch'];
  const WORKOUT_TEMPLATES={
    push:['Incline Dumbbell Press','Chest Press','Cable Lateral Raise','Rope Triceps Pushdown'],
    pull:['Lat Pulldown','Chest-Supported Row','Rear Delt Fly','Preacher Curl'],
    legs:['Hack Squat','Romanian Deadlift','Leg Curl','Calf Raise'],
    upper:['Incline Dumbbell Press','Lat Pulldown','Shoulder Press','Seated Cable Row','Cable Lateral Raise','Rope Triceps Pushdown','Preacher Curl'],
    lower:['Hack Squat','Romanian Deadlift','Leg Curl','Hip Thrust','Calf Raise','Cable Crunch'],
    full_body:['Chest Press','Lat Pulldown','Hack Squat','Romanian Deadlift','Cable Lateral Raise','Cable Crunch'],
    chest:['Incline Dumbbell Press','Chest Press','Cable Fly','Push-Up'],
    back:['Lat Pulldown','Chest-Supported Row','Seated Cable Row','Face Pull'],
    shoulders:['Shoulder Press','Cable Lateral Raise','Rear Delt Fly','Face Pull'],
    arms:['Preacher Curl','Hammer Curl','Rope Triceps Pushdown','Overhead Triceps Extension']
  };

  function AddExerciseDialog({open,onClose,data,dateKey,onAdd,initial=null,plan='workout'}){
    const [name,setName]=useState(''); const [count,setCount]=useState(3); const [load,setLoad]=useState(''); const [reps,setReps]=useState(10); const [group,setGroup]=useState(''); const [usePrevious,setUsePrevious]=useState(true);
    const [unit,setUnit]=useState(data.preferredUnit); const [machineProfile,setMachineProfile]=useState('free_weight'); const [increment,setIncrement]=useState(machineIncrement('free_weight',data.preferredUnit));
    const previous=name?previousWorkout(data,name,dateKey):null;
    useEffect(()=>{if(open){
      const initialName=initial?.name||''; const prior=initial||previousWorkout(data,initialName,dateKey); const setting=exerciseSetting(data,initialName,prior);
      setName(initialName);setCount(initial?getSets(initial,data.preferredUnit).length:3);setLoad(initial?getSets(initial,data.preferredUnit)[0]?.load||'':'');setReps(initial?getSets(initial,data.preferredUnit)[0]?.reps||10:10);setGroup(initial?.group||'');setUsePrevious(!initial);setUnit(setting.unit);setMachineProfile(setting.machineProfile);setIncrement(setting.increment);
    }},[open,initial]);
    useEffect(()=>{if(!open||initial||!name.trim())return;const prior=previousWorkout(data,name,dateKey);const setting=exerciseSetting(data,name,prior);setUnit(setting.unit);setMachineProfile(setting.machineProfile);setIncrement(setting.increment);},[name,open,initial]);
    const selectMachine=value=>{setMachineProfile(value);setIncrement(machineIncrement(value,unit));};
    const selectUnit=value=>{const next=normalizeUnit(value);setUnit(next);setIncrement(machineIncrement(machineProfile,next));};
    const submit=()=>{
      if(!name.trim())return;
      let sets;
      if(usePrevious&&previous){sets=getSets(previous,data.preferredUnit).map(set=>({...set,id:id('set'),done:false,note:''}));}
      else{sets=Array.from({length:clamp(count,1,12)},()=>({id:id('set'),load:Number(load)||0,unit,reps:Number(reps)||0,done:false,type:'working',rir:'',rpe:'',note:''}));}
      onAdd({id:initial?.id||id('workout'),name:name.trim(),group:group.trim(),unit,machineProfile,increment:Number(increment)||machineIncrement(machineProfile,unit),unitLocked:false,setEntries:sets,loggedAt:initial?.loggedAt||new Date().toISOString(),updatedAt:new Date().toISOString()},initial);onClose();
    };
    const suggestions=[...(WORKOUT_TEMPLATES[plan]||[]),...COMMON_EXERCISES].filter((item,index,array)=>array.indexOf(item)===index);
    return html`<${Dialog} open=${open} onClose=${onClose} maxWidth="sm" fullWidth>
      <${DialogTitle}>${initial?'Edit exercise':'Add exercise'}</${DialogTitle}>
      <${DialogContent}><${Stack} spacing=${2} sx=${{pt:.5}}>
        <${TextField} label="Exercise name" value=${name} onChange=${e=>setName(e.target.value)} autoFocus inputProps=${{list:'exercise-suggestions'}}/><datalist id="exercise-suggestions">${COMMON_EXERCISES.map(x=>html`<option value=${x}></option>`)}</datalist>
        <${Typography} variant="caption" color="text.secondary" fontWeight=${800}>${WORKOUT_TEMPLATES[plan]?`${planLabel(plan).toUpperCase()} SUGGESTIONS`:'COMMON EXERCISES'}</${Typography}>
        <${Box} sx=${{display:'flex',gap:.7,flexWrap:'wrap'}}>${suggestions.slice(0,10).map(item=>html`<${Chip} key=${item} label=${item} size="small" variant="outlined" onClick=${()=>setName(item)}/>` )}</${Box}>
        ${previous&&!initial?html`<${Alert} severity="info"><b>Previous:</b> ${getSets(previous,data.preferredUnit).map(s=>`${formatLoad(s.load,s.unit)} × ${s.reps}`).join(' · ')}<${FormControlLabel} sx=${{display:'block',mt:.5}} control=${html`<${Checkbox} checked=${usePrevious} onChange=${e=>setUsePrevious(e.target.checked)}/>`} label="Prefill previous sets as incomplete"/></${Alert}>`:null}
        <${Paper} variant="outlined" sx=${{p:1.5,borderRadius:3}}><${Stack} spacing=${1.3}>
          <${Typography} fontWeight=${800}>Machine and load unit</${Typography}>
          <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1.35fr 1fr'},gap:1}}><${TextField} select label="Equipment profile" value=${machineProfile} onChange=${e=>selectMachine(e.target.value)}>${MACHINE_TYPES.map(item=>html`<${MenuItem} key=${item.value} value=${item.value}>${item.label}</${MenuItem}>`)}</${TextField}><${ToggleButtonGroup} exclusive fullWidth value=${unit} onChange=${(_,value)=>value&&selectUnit(value)}><${ToggleButton} value="kg">kg</${ToggleButton}><${ToggleButton} value="lb">lb</${ToggleButton}></${ToggleButtonGroup}></${Box}>
          <${TextField} label=${`Weight increment (${unit})`} type="number" value=${increment} onChange=${e=>setIncrement(e.target.value)} inputProps=${{min:.1,step:.1}} helperText="Used as the step size for new sets on this exercise."/>
          <${Typography} variant="caption" color="text.secondary">Setline stores the original number and unit on every set. Changing your global default never rewrites completed history.</${Typography}>
        </${Stack}></${Paper}>
        ${!usePrevious||!previous||initial?html`<${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(3,1fr)'},gap:1}}><${TextField} label="Sets" type="number" value=${count} onChange=${e=>setCount(e.target.value)} inputProps=${{min:1,max:12}}/><${TextField} label=${`Load (${unit})`} type="number" value=${load} onChange=${e=>setLoad(e.target.value)} inputProps=${{min:0,step:Number(increment)||.5}}/><${TextField} label="Reps" type="number" value=${reps} onChange=${e=>setReps(e.target.value)} inputProps=${{min:0,max:100}}/></${Box}>`:null}
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


  function FocusModeDialog({open,onClose,workouts,data,dateKey,updateSet,completeSet,removeSet,openGuide}){
    const [index,setIndex]=useState(0);
    useEffect(()=>{if(open)setIndex(0);},[open]);
    if(!workouts.length)return null;
    const safeIndex=Math.min(index,workouts.length-1),workout=workouts[safeIndex],sets=getSets(workout,data.preferredUnit),previous=previousWorkout(data,workout.name,dateKey);
    const previousSets=previous?getSets(previous,data.preferredUnit):[];
    return html`<${Dialog} open=${open} onClose=${onClose} fullScreen scroll="paper" className="focus-dialog">
      <${AppBar} position="sticky" elevation=${0} color="transparent" sx=${{borderBottom:'1px solid',borderColor:'divider'}}><${Toolbar} variant="dense"><${IconButton} edge="start" onClick=${onClose}><${Icon} name="close"/></${IconButton}><${Box} sx=${{flex:1,minWidth:0,ml:1}}><${Typography} variant="caption" color="text.secondary">FOCUS MODE · ${safeIndex+1}/${workouts.length}</${Typography}><${Typography} fontWeight=${850} noWrap>${workout.name}</${Typography}></${Box}><${ToggleButtonGroup} size="small" exclusive value=${normalizeUnit(workout.unit||sets[0]?.unit||data.preferredUnit)} disabled><${ToggleButton} value="kg">kg</${ToggleButton}><${ToggleButton} value="lb">lb</${ToggleButton}></${ToggleButtonGroup}></${Toolbar}></${AppBar}>
      <${DialogContent} sx=${{width:'min(100%,760px)',mx:'auto',pt:2}}>
        ${previous?html`<${Paper} variant="outlined" sx=${{p:1.2,mb:1.4}}><${Typography} variant="caption" color="text.secondary">PREVIOUS · ${formatDate(previous.date)}</${Typography}><${Typography} variant="body2" fontWeight=${750}>${previousSets.map(s=>`${formatLoad(s.load,s.unit)} × ${s.reps}`).join(' · ')}</${Typography}></${Paper}>`:null}
        <div className="focus-head"><span>SET</span><span>PREVIOUS</span><span>LOAD</span><span>REPS</span><span>RIR</span><span></span><span></span></div>
        <${Stack} spacing=${.65}>${sets.map((set,si)=>{const old=previousSets[si];return html`<div className="focus-row" key=${set.id||si}><span className="focus-index">${si+1}</span><span className="focus-prev">${old?`${formatLoad(old.load,old.unit)} × ${old.reps}`:'—'}</span><${TextField} className="set-input" type="number" value=${set.load??''} onChange=${e=>updateSet(safeIndex,si,{load:e.target.value})} InputProps=${{endAdornment:html`<${InputAdornment} position="end">${normalizeUnit(set.unit||workout.unit)}</${InputAdornment}>`}}/><${TextField} className="set-input" type="number" value=${set.reps??''} onChange=${e=>updateSet(safeIndex,si,{reps:e.target.value})}/><${TextField} className="set-input" type="number" value=${set.rir??''} placeholder="—" onChange=${e=>updateSet(safeIndex,si,{rir:e.target.value,rpe:e.target.value===''?'':10-Number(e.target.value)})}/><${IconButton} color=${set.done===false?'default':'success'} onClick=${()=>completeSet(safeIndex,si,set)}><${Icon} name="check"/></${IconButton}><${IconButton} color="error" onClick=${()=>removeSet(safeIndex,si,set)}><${Icon} name="close"/></${IconButton}></div>`;})}</${Stack}>
        <${Button} size="small" startIcon=${html`<${Icon} name="info"/>`} onClick=${()=>openGuide('RIR')} sx=${{mt:1}}>RIR guide</${Button}>
      </${DialogContent}>
      <${DialogActions} sx=${{borderTop:'1px solid',borderColor:'divider',justifyContent:'space-between',px:2,pb:'calc(10px + env(safe-area-inset-bottom))'}}><${Button} disabled=${safeIndex===0} onClick=${()=>setIndex(Math.max(0,safeIndex-1))}>Previous</${Button}><${Button} variant="contained" onClick=${safeIndex===workouts.length-1?onClose:()=>setIndex(safeIndex+1)}>${safeIndex===workouts.length-1?'Exit focus':'Next exercise'}</${Button}></${DialogActions}>
    </${Dialog}>`;
  }

  function WorkoutPage({data,update,selectedDate,setSelectedDate,openGuide,showFeedback,showCompletion}){
    const day=getDay(data,selectedDate); const plan=planForDate(data,selectedDate); const [addOpen,setAddOpen]=useState(false); const [editIndex,setEditIndex]=useState(null); const [advanced,setAdvanced]=useState({}); const [restUntil,setRestUntil]=useState(0); const [focusOpen,setFocusOpen]=useState(false);
    const currentWorkouts=day.workouts;
    const mutateWorkout=(index,fn)=>update(next=>{const target=ensureDayMutable(next,selectedDate).workouts[index];if(target)fn(target);});
    const addExercise=(workout,initial)=>update(next=>{
      const target=ensureDayMutable(next,selectedDate),key=exerciseKey(workout.name);
      if(initial&&editIndex!==null){
        const existing=target.workouts[editIndex],existingSets=getSets(existing,next.preferredUnit).map(set=>set.done===false?{...set,unit:workout.unit}:set);
        target.workouts[editIndex]={...existing,...workout,setEntries:existingSets};
      }else target.workouts.push(workout);
      next.exerciseSettings[key]={unit:normalizeUnit(workout.unit),machineProfile:workout.machineProfile||'free_weight',increment:Number(workout.increment)||machineIncrement(workout.machineProfile,workout.unit),unitLocked:false};
      next.machineProfiles[key]={unit:normalizeUnit(workout.unit),type:workout.machineProfile||'free_weight',increment:Number(workout.increment)||machineIncrement(workout.machineProfile,workout.unit)};
    });
    const updateSet=(wi,si,patch)=>mutateWorkout(wi,workout=>{if(!Array.isArray(workout.setEntries))workout.setEntries=getSets(workout);workout.setEntries[si]={...workout.setEntries[si],unit:normalizeUnit(workout.setEntries[si].unit||workout.unit||data.preferredUnit),...patch};workout.updatedAt=new Date().toISOString();});
    const completeSet=(wi,si,set)=>{const done=set.done===false;updateSet(wi,si,{done});showFeedback(done?'Set saved':'Set reopened');if(done&&data.autoRest)setRestUntil(Date.now()+Number(data.restSeconds||90)*1000);};
    const addSet=(wi)=>mutateWorkout(wi,workout=>{if(!Array.isArray(workout.setEntries))workout.setEntries=getSets(workout);const last=workout.setEntries.at(-1)||{};workout.setEntries.push({...last,id:id('set'),unit:normalizeUnit(workout.unit||last.unit||data.preferredUnit),done:false,note:''});});
    const removeSet=(wi,si,set)=>{if(set.done!==false&&!confirm(`Remove completed set ${si+1}?`))return;mutateWorkout(wi,workout=>{if(!Array.isArray(workout.setEntries))workout.setEntries=getSets(workout);workout.setEntries.splice(si,1);workout.updatedAt=new Date().toISOString();});showFeedback('Set removed');};
    const deleteExercise=wi=>{if(!confirm('Delete this exercise from the selected session?'))return;update(next=>ensureDayMutable(next,selectedDate).workouts.splice(wi,1));showFeedback('Exercise removed');};
    const duplicateExercise=wi=>update(next=>{const target=ensureDayMutable(next,selectedDate);const copy=deepClone(target.workouts[wi]);copy.id=id('workout');copy.name=`${copy.name}`;copy.setEntries=getSets(copy).map(s=>({...s,id:id('set'),done:false}));target.workouts.splice(wi+1,0,copy);});
    const addStarterTemplate=()=>{const template=WORKOUT_TEMPLATES[plan];if(!template?.length)return;const existing=new Set(currentWorkouts.map(workout=>String(workout.name).toLowerCase()));update(next=>{const target=ensureDayMutable(next,selectedDate);for(const name of template){if(existing.has(name.toLowerCase()))continue;const setting=exerciseSetting(next,name);target.workouts.push({id:id('workout'),name,group:'',unit:setting.unit,machineProfile:setting.machineProfile,increment:setting.increment,unitLocked:false,setEntries:Array.from({length:3},()=>({id:id('set'),load:0,unit:setting.unit,reps:10,done:false,type:'working',rir:'',rpe:'',note:''})),loggedAt:new Date().toISOString(),updatedAt:new Date().toISOString()});}});showFeedback(`${planLabel(plan)} starter added`);};
    const changeExerciseUnit=(wi,nextUnit)=>{
      const current=currentWorkouts[wi]; if(!current)return;
      const oldUnit=normalizeUnit(current.unit||getSets(current,data.preferredUnit)[0]?.unit||data.preferredUnit),unit=normalizeUnit(nextUnit);
      if(oldUnit===unit)return;
      update(next=>{
        const workout=ensureDayMutable(next,selectedDate).workouts[wi];if(!workout)return;
        workout.unit=unit;workout.unitLocked=false;workout.increment=machineIncrement(workout.machineProfile||inferredMachineProfile(workout.name),unit);
        workout.setEntries=getSets(workout,next.preferredUnit).map(set=>set.done===false?{...set,load:Number(set.load)?round1(convertWeight(set.load,set.unit||oldUnit,unit)):set.load,unit}:set);
        workout.updatedAt=new Date().toISOString();
        next.exerciseSettings[exerciseKey(workout.name)]={unit,machineProfile:workout.machineProfile||inferredMachineProfile(workout.name),increment:workout.increment,unitLocked:false};
      });
      showFeedback(`New and incomplete sets use ${unit}`);
    };
    const completeWorkout=()=>{
      if(!currentWorkouts.length)return;
      const sets=currentWorkouts.flatMap(workout=>getSets(workout,data.preferredUnit)).filter(s=>s.done!==false&&s.type!=='warmup'); const volume=sets.reduce((sum,s)=>sum+setVolume(s,data.preferredUnit),0); const regions=new Set(currentWorkouts.flatMap(w=>classifyExercise(w.name).primary));
      update(next=>{const target=ensureDayMutable(next,selectedDate);target.sessions.push({id:id('session'),name:`${planLabel(plan)} session`,exerciseCount:currentWorkouts.length,setCount:sets.length,volume,volumeUnit:data.preferredUnit,regions:[...regions],completedAt:new Date().toISOString()});});
      showCompletion({name:`${planLabel(plan)} complete`,exerciseCount:currentWorkouts.length,setCount:sets.length,volume,volumeUnit:data.preferredUnit,regions:[...regions],streak:calculateStreak(data),xpAward:50+Math.min(30,sets.length*2)});
    };
    const changePlan=type=>update(next=>{next.schedule[selectedDate]=type;next.scheduleMeta.configured=true;});
    return html`<div className="page-wrap workout-page">
      <${PageHeader} eyebrow="TRAIN" title="Workout" action=${html`<${Stack} direction="row" spacing=${.8} alignItems="center"><${ToggleButtonGroup} size="small" exclusive value=${data.preferredUnit} onChange=${(_,value)=>value&&update(next=>next.preferredUnit=value)} aria-label="Default weight unit"><${ToggleButton} value="kg">kg</${ToggleButton}><${ToggleButton} value="lb">lb</${ToggleButton}></${ToggleButtonGroup}>${currentWorkouts.length?html`<${Button} variant="outlined" startIcon=${html`<${Icon} name="target"/>`} onClick=${()=>setFocusOpen(true)}>Focus</${Button}>`:null}<${Button} variant="contained" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>setAddOpen(true)}>Add</${Button}></${Stack}>`}/>
      <${DateBar} value=${selectedDate} onChange=${setSelectedDate} label="Workout date"/>

      <${CardShell} sx=${{mb:2}}><${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1.4} alignItems=${{sm:'center'}} justifyContent="space-between"><${Box}><${Typography} variant="overline" color=${isRestType(plan)?'secondary.main':'primary.main'} fontWeight=${800}>PLANNED SESSION</${Typography}><${Typography} variant="h6">${planLabel(plan)}</${Typography}><${Typography} variant="body2" color="text.secondary">${isRestType(plan)?'No missed-workout warning will be created for this planned recovery day.':'Log working sets; warm-ups are excluded from region coverage.'}</${Typography}></${Box}><${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1} sx=${{width:{xs:'100%',sm:'auto'}}}>${WORKOUT_TEMPLATES[plan]?html`<${Button} variant="outlined" onClick=${addStarterTemplate}>Add ${planLabel(plan)} starter</${Button}>`:null}<${TextField} select size="small" label="Change" value=${plan} onChange=${e=>changePlan(e.target.value)} sx=${{minWidth:{xs:'100%',sm:155}}}><${MenuItem} value="push">Push</${MenuItem}><${MenuItem} value="pull">Pull</${MenuItem}><${MenuItem} value="legs">Legs</${MenuItem}><${MenuItem} value="upper">Upper</${MenuItem}><${MenuItem} value="lower">Lower</${MenuItem}><${MenuItem} value="full_body">Full body</${MenuItem}><${MenuItem} value="chest">Chest</${MenuItem}><${MenuItem} value="back">Back</${MenuItem}><${MenuItem} value="shoulders">Shoulders</${MenuItem}><${MenuItem} value="arms">Arms</${MenuItem}><${MenuItem} value="rest">Rest day</${MenuItem}><${MenuItem} value="active_recovery">Active recovery</${MenuItem}><${MenuItem} value="deload">Deload</${MenuItem}></${TextField}></${Stack}></${Stack}></${CardShell}>

      ${isRestType(plan)&&!currentWorkouts.length?html`<${Alert} severity="info" icon=${html`<${Icon} name="rest"/>`} sx=${{mb:2}}>${plan==='rest'?'Rest completely or take an easy walk.':plan==='active_recovery'?'Keep movement light enough that it supports recovery.':'Reduce training stress by lowering sets, load, or effort.'}</${Alert}>`:null}

      <${Stack} spacing=${1.5}>
        ${currentWorkouts.length?currentWorkouts.map((workout,wi)=>{
          const sets=Array.isArray(workout.setEntries)?workout.setEntries:getSets(workout); const regions=classifyExercise(workout.name); const isAdvanced=advanced[workout.id||wi]??data.settings.advancedDefault; const previous=previousWorkout(data,workout.name,selectedDate);
          return html`<${CardShell} key=${workout.id||`${workout.name}-${wi}`}>
            <${Stack} direction="row" alignItems="flex-start" justifyContent="space-between" spacing=${1}>
              <${Box} sx=${{minWidth:0,flex:1}}><${Stack} direction="row" spacing=${.6} alignItems="center" sx=${{minWidth:0}}><${Typography} className="exercise-title" variant="h6">${workout.name}</${Typography}>${workout.group?html`<${Chip} label=${`Group ${workout.group}`} size="small" color="secondary"/>`:null}</${Stack}><${Stack} direction="row" spacing=${.8} alignItems="center" flexWrap="wrap" sx=${{mt:.55}}><${ToggleButtonGroup} className="exercise-unit-toggle" size="small" exclusive value=${normalizeUnit(workout.unit||sets[0]?.unit||data.preferredUnit)} onChange=${(_,value)=>value&&changeExerciseUnit(wi,value)} aria-label=${`${workout.name} weight unit`}><${ToggleButton} value="kg">kg</${ToggleButton}><${ToggleButton} value="lb">lb</${ToggleButton}></${ToggleButtonGroup}><${Typography} variant="caption" color="text.secondary">${machineTypeInfo(workout.machineProfile||inferredMachineProfile(workout.name)).label} · ${workout.increment||machineIncrement(workout.machineProfile,workout.unit)} ${normalizeUnit(workout.unit||data.preferredUnit)} increments</${Typography}></${Stack}><${Box} sx=${{display:'flex',gap:.5,flexWrap:'wrap',mt:.55}}>${regions.primary.map(r=>html`<${Chip} key=${r} size="small" label=${REGION_META[r]?.[0]||r} color="primary" variant="outlined"/>`)}${regions.secondary.slice(0,2).map(r=>html`<${Chip} key=${r} size="small" label=${REGION_META[r]?.[0]||r} variant="outlined"/>`)}</${Box}>${previous?html`<${Typography} variant="caption" color="text.secondary" sx=${{display:'block',mt:.55}}>Previous ${formatDate(previous.date)}: ${getSets(previous,data.preferredUnit).map(s=>`${formatLoad(s.load,s.unit)}×${s.reps||0}`).join(' · ')}</${Typography}>`:null}</${Box}>
              <${Box} sx=${{display:'flex'}}><${Tooltip} title="Duplicate"><${IconButton} size="small" onClick=${()=>duplicateExercise(wi)}><${Icon} name="copy" fontSize="small"/></${IconButton}></${Tooltip}><${Tooltip} title="Edit"><${IconButton} size="small" onClick=${()=>{setEditIndex(wi);setAddOpen(true);}}><${Icon} name="edit" fontSize="small"/></${IconButton}></${Tooltip}><${Tooltip} title="Delete"><${IconButton} size="small" color="error" onClick=${()=>deleteExercise(wi)}><${Icon} name="delete" fontSize="small"/></${IconButton}></${Tooltip}></${Box}>
            </${Stack}>
            <${Divider} sx=${{my:1.5}}/>
            <div className=${`set-grid ${isAdvanced?'advanced':''} set-head`}><span>Set</span><span>Load</span><span>Reps</span>${isAdvanced?html`<span>RIR / type</span>`:null}<span>Done</span><span></span></div>
            <${Stack} spacing=${1} sx=${{mt:.7}}>${sets.map((set,si)=>html`<${Box} key=${set.id||si}>
              <div className=${`set-grid ${isAdvanced?'advanced':''}`}>
                <${Avatar} sx=${{width:30,height:30,fontSize:12,bgcolor:set.done===false?'action.selected':'primary.main',color:set.done===false?'text.secondary':'#fff'}}>${si+1}</${Avatar}>
                <${Stack} spacing=${.2} sx=${{minWidth:0}}><${TextField} className="set-input" aria-label=${`Set ${si+1} load`} type="number" value=${set.load??''} onChange=${e=>updateSet(wi,si,{load:e.target.value})} inputProps=${{min:0,step:Number(workout.increment)||machineIncrement(workout.machineProfile,set.unit||workout.unit)}} InputProps=${{endAdornment:html`<${InputAdornment} position="end">${normalizeUnit(set.unit||workout.unit||data.preferredUnit)}</${InputAdornment}>`}}/>${data.settings.showUnitConversions&&normalizeUnit(set.unit||workout.unit)!==normalizeUnit(data.preferredUnit)&&Number(set.load)>0?html`<${Typography} variant="caption" color="text.secondary" sx=${{pl:.4,whiteSpace:'nowrap'}}>${convertedLoadText(set.load,set.unit||workout.unit,data.preferredUnit)}</${Typography}>`:null}</${Stack}>
                <${TextField} className="set-input" aria-label=${`Set ${si+1} reps`} type="number" value=${set.reps??''} onChange=${e=>updateSet(wi,si,{reps:e.target.value})} inputProps=${{min:0,max:200}}/>
                ${isAdvanced?html`<${Stack} spacing=${.5}><${TextField} className="set-input" aria-label=${`Set ${si+1} RIR`} type="number" value=${set.rir??''} onChange=${e=>updateSet(wi,si,{rir:e.target.value,rpe:e.target.value===''?'':10-Number(e.target.value)})} placeholder="RIR" inputProps=${{min:0,max:10}}/><${TextField} select value=${set.type||'working'} onChange=${e=>updateSet(wi,si,{type:e.target.value})} SelectProps=${{native:true}}><option value="warmup">Warm-up</option><option value="working">Working</option><option value="amrap">AMRAP</option><option value="drop">Drop</option><option value="failure">Failure</option></${TextField}></${Stack}>`:null}
                <${IconButton} aria-label=${set.done===false?'Complete set':'Reopen set'} color=${set.done===false?'default':'success'} onClick=${()=>completeSet(wi,si,set)} sx=${{border:'1px solid',borderColor:set.done===false?'divider':'success.main'}}><${Icon} name="check"/></${IconButton}>
                <${IconButton} aria-label=${`Remove set ${si+1}`} color="error" onClick=${()=>removeSet(wi,si,set)} sx=${{border:'1px solid',borderColor:'divider'}}><${Icon} name="close"/></${IconButton}>
              </div>
              ${isAdvanced?html`<${TextField} fullWidth multiline maxRows=${2} value=${set.note||''} onChange=${e=>updateSet(wi,si,{note:e.target.value})} placeholder="Set note (optional)" sx=${{mt:.7}}/>`:null}
            </${Box}>`)}</${Stack}>
            <${Stack} direction="row" spacing=${1} flexWrap="wrap" sx=${{mt:1.4}}><${Button} size="small" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>addSet(wi)}>Add set</${Button}><${Button} size="small" onClick=${()=>setAdvanced({...advanced,[workout.id||wi]:!isAdvanced})}>${isAdvanced?'Hide advanced':'Advanced'}</${Button}>${isAdvanced?html`<${InfoButton} term="RIR" onOpen=${openGuide}/><${InfoButton} term="RPE" onOpen=${openGuide}/><${InfoButton} term="AMRAP" onOpen=${openGuide}/><${InfoButton} term="Drop set" onOpen=${openGuide}/>`:null}</${Stack}>
          </${CardShell}>`;
        }):html`<${CardShell}><${Box} sx=${{textAlign:'center',py:4}}><${Avatar} sx=${{mx:'auto',mb:1.5,bgcolor:'primary.main',width:56,height:56}}><${Icon} name=${isRestType(plan)?'rest':'workout'}/></${Avatar}><${Typography} variant="h6">${isRestType(plan)?'Planned recovery day':'No exercises yet'}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.5,mb:2}}>${isRestType(plan)?'You can leave this day empty or log optional light work.':'Add the first exercise. Setline can prefill your previous performance.'}</${Typography}><${Button} variant="contained" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>setAddOpen(true)}>Add exercise</${Button}></${Box}></${CardShell}>`}
      </${Stack}>
      ${currentWorkouts.length?html`<${CardShell} sx=${{mt:2}}><${Stack} direction=${{xs:'column',sm:'row'}} spacing=${1.2} alignItems=${{sm:'center'}} justifyContent="space-between"><${Box}><${Typography} variant="h6">Finish the session</${Typography}><${Typography} variant="body2" color="text.secondary">Completed sets are saved continuously. This creates the final summary and streak moment.</${Typography}></${Box}><${Button} variant="contained" color="success" startIcon=${html`<${Icon} name="check"/>`} onClick=${completeWorkout}>Complete workout</${Button}></${Stack}></${CardShell}>`:null}
      <${AddExerciseDialog} open=${addOpen} onClose=${()=>{setAddOpen(false);setEditIndex(null);}} data=${data} dateKey=${selectedDate} initial=${editIndex===null?null:currentWorkouts[editIndex]} onAdd=${addExercise} plan=${plan}/>
      <${FocusModeDialog} open=${focusOpen} onClose=${()=>setFocusOpen(false)} workouts=${currentWorkouts} data=${data} dateKey=${selectedDate} updateSet=${updateSet} completeSet=${completeSet} removeSet=${removeSet} openGuide=${openGuide}/>
      ${restUntil?html`<${RestTimer} until=${restUntil} onStop=${()=>setRestUntil(0)}/>`:null}
    </div>`;
  }

  function AddFoodDialog({open,onClose,data,initial,onSave,defaultMeal='Breakfast'}){
    const mobile=useMediaQuery('(max-width:600px)');
    const blank={name:'',meal:defaultMeal,kcal:'',protein:'',carbs:'',fat:'',amount:1,unit:'serving',favorite:false,barcode:''};
    const [form,setForm]=useState(blank); const [query,setQuery]=useState(''); const [results,setResults]=useState([]); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
    useEffect(()=>{if(open){setForm(initial?{...blank,...initial,favorite:data.favoriteFoods.some(f=>String(f.name).toLowerCase()===String(initial.name).toLowerCase())}:blank);setQuery('');setResults([]);setError('');}},[open,initial,defaultMeal]);
    const patch=(key,value)=>setForm({...form,[key]:value});
    const applyProduct=product=>{if(product._setlinePreset){setForm({...form,name:product.name,kcal:product.kcal,protein:product.protein,carbs:product.carbs,fat:product.fat,amount:product.amount,unit:product.unit,barcode:''});setResults([]);return;}const n=product.nutriments||{};setForm({...form,name:product.product_name||product.generic_name||form.name,kcal:Math.round(Number(n['energy-kcal_100g']||0)),protein:round1(n.proteins_100g||0),carbs:round1(n.carbohydrates_100g||0),fat:round1(n.fat_100g||0),amount:100,unit:'g',barcode:product.code||form.barcode});setResults([]);};
    const search=async()=>{const term=query.trim().toLowerCase();if(!term)return;const local=COMMON_FOODS.filter(item=>[item.name,...item.aliases].some(label=>label.toLowerCase().includes(term)||term.includes(label.toLowerCase()))).slice(0,6).map(item=>({...item,_setlinePreset:true}));setResults(local);setLoading(true);setError('');try{const url=`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=6`;const res=await fetch(url);if(!res.ok)throw new Error('Search failed');const json=await res.json();const packaged=(json.products||[]).filter(p=>p.product_name&&p.nutriments).slice(0,6);setResults([...local,...packaged]);if(!local.length&&!packaged.length)setError('No match found. Enter the nutrition manually.');}catch(err){if(!local.length)setError('Online packaged-food search is unavailable. Manual logging still works.');}finally{setLoading(false);}};
    const lookupBarcode=async(code=form.barcode)=>{if(!code.trim())return;setLoading(true);setError('');try{const res=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code.trim())}.json`);const json=await res.json();if(!json.product)throw new Error('Not found');applyProduct({...json.product,code});}catch(err){setError('Barcode not found. Enter the food manually.');}finally{setLoading(false);}};
    const scanImage=async file=>{if(!file)return;if(!('BarcodeDetector' in window)){setError('Camera barcode detection is not supported in this browser. Type the barcode instead.');return;}setLoading(true);try{const bitmap=await createImageBitmap(file);const detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});const codes=await detector.detect(bitmap);if(!codes.length)throw new Error('No barcode');patch('barcode',codes[0].rawValue);await lookupBarcode(codes[0].rawValue);}catch(err){setError('No barcode was detected in that image.');}finally{setLoading(false);}};
    const submit=()=>{if(!form.name.trim()||!Number.isFinite(Number(form.kcal))){setError('Enter a food name and calories.');return;}onSave({...form,id:initial?.id||id('food'),name:form.name.trim(),kcal:Number(form.kcal)||0,protein:Number(form.protein)||0,carbs:Number(form.carbs)||0,fat:Number(form.fat)||0,amount:Number(form.amount)||1,loggedAt:initial?.loggedAt||new Date().toISOString(),updatedAt:new Date().toISOString()});onClose();};
    return html`<${Dialog} className="food-dialog" open=${open} onClose=${onClose} maxWidth="sm" fullWidth fullScreen=${mobile} scroll="paper">
      <${DialogTitle}>${initial?'Edit food':'Log food'}</${DialogTitle}>
      <${DialogContent} dividers className="food-dialog-content"><${Stack} spacing=${1.4} sx=${{pt:.25}}>
        <${Box}><${Typography} component="label" variant="caption" color="text.secondary" fontWeight=${800} sx=${{display:'block',mb:.55}}>SEARCH FOODS</${Typography}><${Box} sx=${{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:.8}}><${TextField} placeholder="e.g. boiled eggs" aria-label="Search foods" value=${query} onChange=${e=>setQuery(e.target.value)} onKeyDown=${e=>e.key==='Enter'&&search()} InputProps=${{startAdornment:html`<${InputAdornment} position="start"><${Icon} name="search"/></${InputAdornment}>`}}/><${Button} variant="outlined" onClick=${search} disabled=${loading}>Search</${Button}></${Box}></${Box}>
        ${loading?html`<${LinearProgress}/>`:null}${error?html`<${Alert} severity="info">${error}</${Alert}>`:null}
        ${results.length?html`<${Paper} variant="outlined" sx=${{maxHeight:230,overflow:'auto'}}>${results.map((p,index)=>html`<${ListItemButton} key=${p.code||p.name||index} onClick=${()=>applyProduct(p)}><${ListItemText} primary=${p._setlinePreset?p.name:p.product_name} secondary=${p._setlinePreset?`${p.note} · ${Math.round(p.kcal)} kcal`:`${p.brands||'Packaged food'} · ${Math.round(Number(p.nutriments?.['energy-kcal_100g']||0))} kcal/100g`}/></${ListItemButton}>`)}</${Paper}>`:null}
        <${Divider}>OR ENTER MANUALLY</${Divider}>
        <${TextField} label="Food or meal" value=${form.name} onChange=${e=>patch('name',e.target.value)}/>
        <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'repeat(4,1fr)'},gap:1}}><${TextField} label="Calories" type="number" value=${form.kcal} onChange=${e=>patch('kcal',e.target.value)}/><${TextField} label="Protein (g)" type="number" value=${form.protein} onChange=${e=>patch('protein',e.target.value)}/><${TextField} label="Carbs (g)" type="number" value=${form.carbs} onChange=${e=>patch('carbs',e.target.value)}/><${TextField} label="Fat (g)" type="number" value=${form.fat} onChange=${e=>patch('fat',e.target.value)}/></${Box}>
        <${Box} sx=${{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1}}><${TextField} label="Amount" type="number" value=${form.amount} onChange=${e=>patch('amount',e.target.value)}/><${TextField} select label="Unit" value=${form.unit} onChange=${e=>patch('unit',e.target.value)}><${MenuItem} value="serving">Serving</${MenuItem}><${MenuItem} value="g">Grams</${MenuItem}><${MenuItem} value="ml">Millilitres</${MenuItem}><${MenuItem} value="cup">Cup</${MenuItem}><${MenuItem} value="piece">Piece</${MenuItem}><${MenuItem} value="scoop">Scoop</${MenuItem}><${MenuItem} value="can">Can</${MenuItem}></${TextField}><${TextField} select label="Meal" value=${form.meal} onChange=${e=>patch('meal',e.target.value)}><${MenuItem} value="Breakfast">Breakfast</${MenuItem}><${MenuItem} value="Lunch">Lunch</${MenuItem}><${MenuItem} value="Dinner">Dinner</${MenuItem}><${MenuItem} value="Snack">Snack</${MenuItem}></${TextField}></${Box}>
        <${Box} sx=${{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto auto',gap:1}}><${TextField} label="Barcode" value=${form.barcode} onChange=${e=>patch('barcode',e.target.value)}/><${Button} variant="outlined" onClick=${()=>lookupBarcode()}>Lookup</${Button}><${Button} variant="outlined" component="label">Scan<input className="sr-only" type="file" accept="image/*" capture="environment" onChange=${e=>scanImage(e.target.files?.[0])}/></${Button}></${Box}>
        <${FormControlLabel} control=${html`<${Checkbox} checked=${!!form.favorite} onChange=${e=>patch('favorite',e.target.checked)}/>`} label="Save to favourites"/>
      </${Stack}></${DialogContent}>
      <${DialogActions} className="food-dialog-actions"><${Button} onClick=${onClose}>Cancel</${Button}><${Button} variant="contained" color="secondary" onClick=${submit}>Save food</${Button}></${DialogActions}>
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
    return html`<div className="page-wrap nutrition-page">
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
            ${entries.length?html`<${Stack} spacing=${.9}>${entries.map(item=>html`<${Paper} key=${item.id} variant="outlined" sx=${{p:1.2,borderRadius:2}}><div className="food-row"><div className="food-copy"><${Typography} className="food-name" fontWeight=${750}>${item.name}</${Typography}><${Typography} className="food-meta" variant="caption" color="text.secondary">${item.amount||1} ${item.unit||'serving'} · P ${round1(item.protein||0)} · C ${round1(item.carbs||0)} · F ${round1(item.fat||0)}</${Typography}></div><${Typography} className="food-kcal" fontWeight=${800} color="secondary.main">${Math.round(item.kcal||0)} kcal</${Typography}><div className="food-actions"><${IconButton} size="small" aria-label=${`Edit ${item.name}`} onClick=${()=>{setEditItem(item);setDefaultMeal(meal);setDialogOpen(true);}}><${Icon} name="edit" fontSize="small"/></${IconButton}><${IconButton} size="small" color="error" aria-label=${`Delete ${item.name}`} onClick=${()=>removeFood(item)}><${Icon} name="delete" fontSize="small"/></${IconButton}></div></div></${Paper}>`)}</${Stack}>`:html`<${Button} fullWidth variant="outlined" color="secondary" startIcon=${html`<${Icon} name="add"/>`} onClick=${()=>{setEditItem(null);setDefaultMeal(meal);setDialogOpen(true);}}>Add ${meal.toLowerCase()}</${Button}>`}
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
    const [period,setPeriod]=useState(7); const report=regionReport(data,selectedDate); const prs=computePRs(data); const progression=progressionSummary(data,selectedDate); const missions=weeklyMissions(data,selectedDate); const mastery=exerciseMastery(data).slice(0,8); const milestones=milestoneItems(data,progression);
    const dates=Array.from({length:period},(_,i)=>shiftDateKey(selectedDate,-(period-1-i)));
    const volumeValues=dates.map(key=>getDay(data,key).workouts.reduce((sum,w)=>sum+getSets(w,data.preferredUnit).reduce((a,s)=>a+setVolume(s,data.preferredUnit),0),0));
    const weightEntries=Object.entries(data.bodyWeights||{}).filter(([key])=>key<=selectedDate).sort(([a],[b])=>a.localeCompare(b)).slice(-Math.max(7,period));
    const addWeight=()=>{const raw=prompt(`Bodyweight in ${data.preferredUnit}:`,data.preferredUnit==='kg'?String(data.bodyWeights?.[selectedDate]||data.bodyWeightKg||''):String(round1((data.bodyWeights?.[selectedDate]||data.bodyWeightKg||0)*2.20462)));if(raw===null)return;let value=Number(raw);if(!Number.isFinite(value)||value<=0)return;if(data.preferredUnit==='lb')value=value/2.20462;update(next=>{next.bodyWeights[selectedDate]=round1(value);next.bodyWeightKg=round1(value);});showFeedback('Bodyweight saved');};
    const actionItems=report.priorities.slice(0,3);
    const calendarDates=Array.from({length:28},(_,i)=>shiftDateKey(selectedDate,-(27-i)));
    return html`<div className="page-wrap progress-page">
      <${PageHeader} eyebrow="REVIEW" title="Progress" action=${html`<${ToggleButtonGroup} size="small" exclusive value=${period} onChange=${(_,v)=>v&&setPeriod(v)}><${ToggleButton} value=${7}>7D</${ToggleButton}><${ToggleButton} value=${30}>30D</${ToggleButton}></${ToggleButtonGroup}>`}/>
      <${DateBar} value=${selectedDate} onChange=${setSelectedDate} label="Report ending" sticky=${false}/>
      ${data.gamification?.enabled!==false?html`<div className="progression-grid"><${CardShell} className="level-card"><${Stack} direction="row" justifyContent="space-between" alignItems="flex-start"><div><${Typography} variant="caption" color="text.secondary">SETLINE LEVEL</${Typography}><${Typography} variant="h4">${progression.level}</${Typography}><${Typography} variant="body2" fontWeight=${800}>${progression.rank}</${Typography}></div><div className="level-badge"><${Icon} name="trophy"/></div></${Stack}><div className="xp-line large"><span style=${{width:`${progression.levelProgress}%`}}></span></div><${Typography} variant="caption" color="text.secondary">${progression.xp} XP · ${Math.max(0,Math.ceil(progression.next-progression.xp))} to next level</${Typography}></${CardShell}><${CardShell}><${SectionHeading} title="Weekly missions" subtitle="Consistency rewards, not maximum weight"/><${Stack} spacing=${1}>${missions.map(mission=>html`<div className="mission-row" key=${mission.id}><div className=${`mission-check ${mission.done?'done':''}`}>${mission.done?'✓':''}</div><div className="mission-copy"><${Typography} variant="body2" fontWeight=${760}>${mission.title}</${Typography}><${Typography} variant="caption" color="text.secondary">${Math.min(mission.progress,mission.target)} / ${mission.target} ${mission.unit} · +${mission.reward} XP</${Typography}><div className="mission-line"><span style=${{width:`${mission.percent}%`}}></span></div></div></div>`)}</${Stack}></${CardShell}></div><div className="progression-grid compact"><${CardShell}><${SectionHeading} title="Exercise mastery" subtitle="Based on repeated practice, not strength ranking"/>${mastery.length?html`<${Stack} spacing=${1}>${mastery.map(item=>html`<div className="mastery-row" key=${item.name}><div><${Typography} variant="body2" fontWeight=${760}>${item.name}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.sessions} sessions · ${item.sets} sets</${Typography}></div><${Chip} label=${item.tier} color=${item.tier==='Mastered'?'secondary':'primary'} variant="outlined"/></div>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">Log repeated sessions to build exercise mastery.</${Typography}>`}</${CardShell}><${CardShell}><${SectionHeading} title="Milestones" subtitle="Personal progress only"/><div className="milestone-grid">${milestones.map(item=>html`<div className=${`milestone ${item.done?'done':''}`} key=${item.id}><${Icon} name=${item.done?'trophy':'lock'} fontSize="small"/><span>${item.title}</span></div>`)}</div></${CardShell}></div>`:null}
      <div className="desktop-grid">
        <${Stack} spacing=${2}>
          <${CardShell}>
            <${SectionHeading} title="Weekly coaching report" subtitle="Primary sets count 1.0; secondary sets count 0.5"/>
            ${report.workingSets<4?html`<${Alert} severity="info">More workout data is needed before Setline can make a useful recommendation.</${Alert}>`:actionItems.length?html`<${Alert} severity="warning"><b>Next-week focus:</b> ${actionItems.map(x=>x.label).join(', ')}. Suggestions are based on your logged working sets, not a diagnosis or guarantee of growth.</${Alert}>`:html`<${Alert} severity="success">Coverage looks reasonably balanced. Keep progressing the exercises already producing results.</${Alert}>`}
            <${Stack} spacing=${1.2} sx=${{mt:1.8}}>${report.items.map(item=>html`<${Box} key=${item.key}><${Stack} direction="row" justifyContent="space-between" alignItems="baseline"><${Box}><${Typography} variant="body2" fontWeight=${750}>${item.label}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.group}</${Typography}></${Box}><${Typography} variant="body2" fontWeight=${800} color=${statusColor(item.status)}>${item.value} / ${item.target}</${Typography}></${Stack}><div className="region-bar"><span style=${{width:String(clamp(item.ratio*100,0,100))+'%',backgroundColor:regionHex(item.status)}}></span></div></${Box}>`)}</${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Training volume" subtitle=${String(period)+`-day normalized ${data.preferredUnit} × reps`} />
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
            ${prs.length?html`<${Stack} divider=${html`<${Divider} flexItem/>`}>${prs.map(pr=>html`<${Box} key=${pr.name} sx=${{py:1,display:'flex',justifyContent:'space-between',gap:2}}><${Box} sx=${{minWidth:0}}><${Typography} className="exercise-title" fontWeight=${750}>${pr.name}</${Typography}><${Typography} variant="caption" color="text.secondary">${formatDate(pr.date)} · ${formatLoad(pr.load,pr.unit)} × ${pr.reps}${data.settings.showUnitConversions&&normalizeUnit(pr.unit)!==normalizeUnit(data.preferredUnit)?` · ${convertedLoadText(pr.load,pr.unit,data.preferredUnit)}`:''}</${Typography}></${Box}><${Chip} label=${`${Math.round(pr.estimate)} ${data.preferredUnit} est.`} color="primary" variant="outlined"/></${Box}>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">Complete weighted sets to populate personal records.</${Typography}>`}
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Action plan" subtitle="Based on the last seven days"/>
            ${actionItems.length?html`<${Stack} spacing=${1.35}>${actionItems.map((item,index)=>html`<${Paper} key=${item.key} variant="outlined" sx=${{p:1.7,borderRadius:2,minWidth:0}}><${Typography} variant="caption" color="text.secondary" fontWeight=${800}>PRIORITY ${index+1}</${Typography}><${Typography} fontWeight=${800} sx=${{mt:.25}}>${item.label}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:.45,lineHeight:1.55}}>${item.value} of ${item.target} target sets. Consider ${REGION_SUGGESTIONS[item.key]?.slice(0,2).join(' or ')}.</${Typography}></${Paper}>`)}</${Stack}>`:html`<${Typography} variant="body2" color="text.secondary">No major low-coverage region is currently flagged.</${Typography}>`}
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
      <${DialogContent} dividers><${TextField} fullWidth placeholder="Search RIR, RPE, AMRAP, PPL, Bro Split…" value=${query} onChange=${e=>setQuery(e.target.value)} InputProps=${{startAdornment:html`<${InputAdornment} position="start"><${Icon} name="search"/></${InputAdornment}>`}} sx=${{mb:2}}/>
        ${filtered.length?filtered.map(item=>html`<${Accordion} key=${item.term} defaultExpanded=${query&&(`${item.term} ${item.title}`.toLowerCase().includes(query.toLowerCase()))} disableGutters><${AccordionSummary} expandIcon=${html`<${Icon} name="chevron"/>`}><${Box}><${Typography} fontWeight=${800}>${item.term}</${Typography}><${Typography} variant="caption" color="text.secondary">${item.title}</${Typography}></${Box}></${AccordionSummary}><${AccordionDetails}><${Typography} className="guide-copy" variant="body2">${item.summary}</${Typography}>${item.recommended?html`<${Box} className="guide-facts" sx=${{mt:1.4}}><${Typography} variant="body2"><b>Recommended:</b> ${item.recommended}</${Typography}><${Typography} variant="body2" sx=${{mt:.7}}><b>Advantages:</b> ${item.advantages}</${Typography}><${Typography} variant="body2" sx=${{mt:.7}}><b>Watch for:</b> ${item.drawbacks}</${Typography}><${Typography} variant="body2" sx=${{mt:.7}}><b>Best for:</b> ${item.bestFor}</${Typography}></${Box}>`:null}<${Typography} className="guide-example" variant="body2" color="primary.main"><b>Example:</b> ${item.example}</${Typography}></${AccordionDetails}></${Accordion}>`):html`<${Alert} severity="info">No guide entry matches that search.</${Alert}>`}
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
    const exportWorkoutCsv=()=>{
      const rows=[['date','exercise','set','load','unit','load_kg','reps','type','rir','rpe','done','machine_profile']];
      for(const [date,day] of Object.entries(data.days||{}).sort(([a],[b])=>a.localeCompare(b))){for(const workout of day.workouts||[]){getSets(workout,data.preferredUnit).forEach((set,index)=>rows.push([date,workout.name,index+1,set.load,normalizeUnit(set.unit||workout.unit),round1(convertWeight(set.load,set.unit||workout.unit,'kg')),set.reps,set.type||'working',set.rir??'',set.rpe??'',set.done!==false,workout.machineProfile||'']));}}
      const csv=rows.map(row=>row.map(value=>`"${String(value??'').replaceAll('"','""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`setline-workouts-${localDateKey()}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showFeedback('Workout CSV exported');
    };
    const importData=async file=>{if(!file)return;try{const parsed=JSON.parse(await file.text());const incoming=normaliseState(parsed.data||parsed);update(next=>Object.assign(next,mergeStates(next,incoming)));showFeedback('Backup merged');}catch(err){showFeedback('Backup could not be read');}};
    const restoreBackup=()=>{const backup=parseCandidate(localStorage.getItem(BACKUP_KEY));if(!backup){showFeedback('No recovery backup found');return;}if(!confirm('Merge the last automatic backup into current data?'))return;update(next=>Object.assign(next,mergeStates(next,backup)));showFeedback('Backup restored');};
    const integrity=()=>{const issues=[];if(!data.days||typeof data.days!=='object')issues.push('Days container missing');for(const [key,day] of Object.entries(data.days||{})){if(!Array.isArray(day.workouts))issues.push(`${key}: workouts invalid`);if(!Array.isArray(day.calories))issues.push(`${key}: nutrition invalid`);}showFeedback(issues.length?`${issues.length} issue${issues.length===1?'':'s'} found`:`Data check passed · ${recordCount(data)} records`);};
    const savePlan=(index,value)=>update(next=>{next.weeklyPlan[index]=value;next.scheduleMeta.configured=true;});
    const habit=data.privateHabit||{}; const habitDays=habit.enabled&&habit.startDate?Math.max(0,Math.floor((dateFromKey(localDateKey())-dateFromKey(habit.startDate))/86400000)+1):0;
    const resetHabit=()=>{if(!confirm('Reset this private habit counter today?'))return;update(next=>{next.privateHabit.personalBest=Math.max(Number(next.privateHabit.personalBest)||0,habitDays);next.privateHabit.startDate=localDateKey();});showFeedback('Counter reset');};
    const weekdays=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    return html`<div className="page-wrap profile-page">
      <${PageHeader} eyebrow="YOU" title="Profile" action=${html`<${Chip} label=${`v${APP_VERSION}`} variant="outlined"/>`}/>
      ${updateReady?html`<${Alert} severity="info" action=${html`<${Button} color="inherit" size="small" onClick=${applyUpdate}>Update now</${Button}>`} sx=${{mb:2}}>A new Setline version is ready. Your current data will remain in the permanent storage key.</${Alert}>`:null}
      <div className="desktop-grid profile-grid">
        <${Stack} spacing=${2.5}>
          <${CardShell}>
            <${SectionHeading} title="Your profile" subtitle=${goalLabel(data.profile.goal)+' · '+data.profile.experience} action=${html`<${Button} size="small" onClick=${openOnboarding}>Run setup</${Button}>`}/>
            <${Stack} spacing=${1.5}><${TextField} label="Name" value=${profile.name||''} onChange=${e=>setProfile({...profile,name:e.target.value})}/><${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:1}}><${TextField} select label="Goal" value=${profile.goal||'build_muscle'} onChange=${e=>setProfile({...profile,goal:e.target.value})}><${MenuItem} value="build_muscle">Build muscle</${MenuItem}><${MenuItem} value="strength">Build strength</${MenuItem}><${MenuItem} value="fat_loss">Fat loss</${MenuItem}><${MenuItem} value="general">General fitness</${MenuItem}></${TextField}><${TextField} select label="Experience" value=${profile.experience||'intermediate'} onChange=${e=>setProfile({...profile,experience:e.target.value})}><${MenuItem} value="beginner">Beginner</${MenuItem}><${MenuItem} value="intermediate">Intermediate</${MenuItem}><${MenuItem} value="advanced">Advanced</${MenuItem}></${TextField}></${Box}><${Alert} severity="info"><b>${splitInfo(profile.split).label}</b> · ${clamp(profile.trainingDays,1,7)} training day${clamp(profile.trainingDays,1,7)===1?'':'s'}. Use <b>Run setup</b> to change split, equipment or movement restrictions safely.</${Alert}><${TextField} label="Equipment" value=${(profile.equipment||[]).join(', ')} onChange=${e=>setProfile({...profile,equipment:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)})}/><${TextField} label="Movements to avoid" value=${profile.avoid||''} onChange=${e=>setProfile({...profile,avoid:e.target.value})}/><${Button} variant="contained" onClick=${saveProfile}>Save profile</${Button}></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Appearance" subtitle="Light, dark or phone setting"/>
            <${ToggleButtonGroup} exclusive fullWidth value=${data.settings.theme||'system'} onChange=${(_,value)=>value&&update(next=>next.settings.theme=value)}><${ToggleButton} value="light">Light</${ToggleButton}><${ToggleButton} value="dark">Dark</${ToggleButton}><${ToggleButton} value="system">System</${ToggleButton}></${ToggleButtonGroup}>
            <${Divider} sx=${{my:1.5}}/>
            <${Stack} spacing=${.3}><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.reducedMotion} onChange=${e=>update(next=>next.settings.reducedMotion=e.target.checked)}/>`} label="Reduce animations"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.haptics} onChange=${e=>update(next=>next.settings.haptics=e.target.checked)}/>`} label="Vibration feedback"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.advancedDefault} onChange=${e=>update(next=>next.settings.advancedDefault=e.target.checked)}/>`} label="Show advanced workout fields by default"/><${FormControlLabel} control=${html`<${Switch} checked=${!!data.settings.highContrast} onChange=${e=>update(next=>next.settings.highContrast=e.target.checked)}/>`} label="Higher interface contrast"/><${FormControlLabel} control=${html`<${Switch} checked=${data.gamification?.enabled!==false} onChange=${e=>update(next=>next.gamification.enabled=e.target.checked)}/>`} label="Setline XP, missions and mastery"/></${Stack}>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Weekly schedule" subtitle="Rest, active recovery and deload are real plan types"/>
            <${Stack} spacing=${1}>${weekdays.map((day,index)=>html`<${Stack} key=${day} direction="row" spacing=${1} alignItems="center"><${Typography} variant="body2" fontWeight=${700} sx=${{width:86,flexShrink:0}}>${day}</${Typography}><${TextField} select fullWidth value=${data.weeklyPlan[index]} onChange=${e=>savePlan(index,e.target.value)}><${MenuItem} value="push">Push</${MenuItem}><${MenuItem} value="pull">Pull</${MenuItem}><${MenuItem} value="legs">Legs</${MenuItem}><${MenuItem} value="upper">Upper</${MenuItem}><${MenuItem} value="lower">Lower</${MenuItem}><${MenuItem} value="full_body">Full body</${MenuItem}><${MenuItem} value="chest">Chest</${MenuItem}><${MenuItem} value="back">Back</${MenuItem}><${MenuItem} value="shoulders">Shoulders</${MenuItem}><${MenuItem} value="arms">Arms</${MenuItem}><${MenuItem} value="workout">Workout</${MenuItem}><${MenuItem} value="rest">Rest day</${MenuItem}><${MenuItem} value="active_recovery">Active recovery</${MenuItem}><${MenuItem} value="deload">Deload</${MenuItem}></${TextField}></${Stack}>`)}</${Stack}><${FormControlLabel} sx=${{mt:1}} control=${html`<${Switch} checked=${data.autoShiftMissed!==false} onChange=${e=>update(next=>next.autoShiftMissed=e.target.checked)}/>`} label="Move a missed workout forward"/>
          </${CardShell}>

          <${CardShell}>
            <${SectionHeading} title="Recovery check-in" subtitle=${readiness(data.recovery?.[recoveryDate])?.label||'No score yet'}/>
            <${Stack} spacing=${1.8}><${TextField} type="date" label="Date" value=${recoveryDate} onChange=${e=>setRecoveryDate(e.target.value)} InputLabelProps=${{shrink:true}} inputProps=${{max:localDateKey()}}/><${TextField} label="Sleep (hours)" type="number" value=${recoveryDraft.sleep} onChange=${e=>setRecoveryDraft({...recoveryDraft,sleep:e.target.value})} inputProps=${{min:0,max:16,step:.1}}/>
              ${[['Soreness','soreness'],['Energy','energy'],['Stress','stress']].map(([label,key])=>html`<${Box} key=${key}><${Stack} direction="row" justifyContent="space-between"><${Typography} variant="body2" fontWeight=${700}>${label}</${Typography}><${Typography} variant="body2" color="text.secondary">${recoveryDraft[key]}</${Typography}></${Stack}><${Slider} min=${1} max=${5} step=${1} marks value=${Number(recoveryDraft[key]||3)} onChange=${(_,value)=>setRecoveryDraft({...recoveryDraft,[key]:value})}/></${Box}>`)}
              <${TextField} label="Recovery note" multiline minRows=${2} value=${recoveryDraft.note||''} onChange=${e=>setRecoveryDraft({...recoveryDraft,note:e.target.value})}/><${Button} variant="contained" onClick=${saveRecovery}>Save check-in</${Button}>
            </${Stack}>
          </${CardShell}>
        </${Stack}>

        <${Stack} spacing=${2.5}>
          <${CardShell}>
            <${SectionHeading} title="Daily targets" subtitle="Nutrition dashboard goals"/>
            <${Box} sx=${{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',sm:'1fr 1fr'},columnGap:1.5,rowGap:2}}><${TextField} label="Calories" type="number" value=${data.calorieGoal} onChange=${e=>update(next=>next.calorieGoal=Number(e.target.value)||0)}/><${TextField} label="Protein (g)" type="number" value=${data.proteinGoal} onChange=${e=>update(next=>next.proteinGoal=Number(e.target.value)||0)}/><${TextField} label="Carbs (g)" type="number" value=${data.carbsGoal} onChange=${e=>update(next=>next.carbsGoal=Number(e.target.value)||0)}/><${TextField} label="Fat (g)" type="number" value=${data.fatGoal} onChange=${e=>update(next=>next.fatGoal=Number(e.target.value)||0)}/></${Box}>
            <${TextField} select fullWidth label="Default unit for new exercises" value=${data.preferredUnit} onChange=${e=>update(next=>next.preferredUnit=e.target.value)} sx=${{mt:2}}><${MenuItem} value="kg">Kilograms</${MenuItem}><${MenuItem} value="lb">Pounds</${MenuItem}></${TextField}><${FormControlLabel} sx=${{mt:1}} control=${html`<${Switch} checked=${data.settings.showUnitConversions!==false} onChange=${e=>update(next=>next.settings.showUnitConversions=e.target.checked)}/>`} label="Show converted values under mixed-unit loads"/><${Typography} variant="caption" color="text.secondary">This is only the default for new exercises and normalized charts. Every logged set keeps its original kg or lb value.</${Typography}>
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
            <${Stack} spacing=${1}><${Button} variant="contained" startIcon=${html`<${Icon} name="download"/>`} onClick=${exportData}>Export backup</${Button}><${Button} variant="outlined" startIcon=${html`<${Icon} name="download"/>`} onClick=${exportWorkoutCsv}>Export workout CSV</${Button}><${Button} variant="outlined" component="label" startIcon=${html`<${Icon} name="upload"/>`}>Import and merge<input className="sr-only" type="file" accept="application/json" onChange=${e=>importData(e.target.files?.[0])}/></${Button}><${Button} variant="outlined" onClick=${restoreBackup}>Restore automatic backup</${Button}><${Button} variant="outlined" onClick=${integrity}>Run data-integrity check</${Button}><${Typography} variant="caption" color="text.secondary">${recordCount(data)} workout, nutrition and session records. Last save: ${data.updatedAt?new Date(data.updatedAt).toLocaleString():'Not recorded'}.</${Typography}></${Stack}>
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
    return html`<div className="completion-overlay" role="dialog" aria-modal="true" aria-label="Workout complete"><${Card} className="completion-card"><div className="completion-flame">🔥</div><${Typography} variant="overline" color="secondary.main" fontWeight=${900}>STREAK EXTENDED</${Typography}><${Typography} variant="h3" sx=${{fontWeight:900,my:.5}}>${count}</${Typography}><${Typography} variant="h5">${summary.name}</${Typography}><${Typography} variant="body2" color="text.secondary" sx=${{mt:1,mb:1}}>Your session, weekly muscle-region report and progress totals are saved.</${Typography}>${summary.xpAward?html`<${Chip} icon=${html`<${Icon} name="bolt"/>`} label=${`+${summary.xpAward} XP`} color="secondary" sx=${{mb:1.5}}/>`:null}<${Box} sx=${{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,mb:2}}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${summary.exerciseCount}</${Typography}><${Typography} variant="caption" color="text.secondary">Exercises</${Typography}></${Paper}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${summary.setCount}</${Typography}><${Typography} variant="caption" color="text.secondary">Sets</${Typography}></${Paper}><${Paper} variant="outlined" sx=${{p:1,borderRadius:3}}><${Typography} variant="h6">${Math.round(summary.volume)}</${Typography}><${Typography} variant="caption" color="text.secondary">Volume (${summary.volumeUnit||'kg'})</${Typography}></${Paper}></${Box}>${summary.regions?.length?html`<${Box} sx=${{display:'flex',justifyContent:'center',gap:.6,flexWrap:'wrap',mb:2}}>${summary.regions.slice(0,5).map(r=>html`<${Chip} key=${r} label=${REGION_META[r]?.[0]||r} size="small"/>`)}</${Box}>`:null}<${Button} fullWidth variant="contained" size="large" onClick=${onClose}>Done</${Button}></${Card}></div>`;
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
    useEffect(()=>{setThemeMeta(resolvedMode);document.documentElement.style.colorScheme=resolvedMode;document.body.classList.toggle('reduce-motion',!!data.settings.reducedMotion);document.body.classList.toggle('theme-light',resolvedMode==='light');document.body.classList.toggle('theme-dark',resolvedMode==='dark');},[resolvedMode,data.settings.reducedMotion]);
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
      ${data.changelogSeen!==APP_VERSION&&!changelogOpen?html`<${Paper} elevation=${12} sx=${{position:'fixed',left:{xs:12,sm:'auto'},right:{xs:12,sm:24},bottom:'calc(82px + env(safe-area-inset-bottom))',zIndex:1250,p:1.3,borderRadius:3,display:'flex',alignItems:'center',gap:1.5,maxWidth:390}}><${Avatar} sx=${{bgcolor:'primary.main'}}><${Icon} name="spark"/></${Avatar}><${Box} sx=${{flex:1,minWidth:0}}><${Typography} fontWeight=${800}>Setline ${APP_VERSION} is here</${Typography}><${Typography} variant="caption" color="text.secondary">Editorial minimal interface, pastel modular tiles, Focus Mode, XP, missions and mastery.</${Typography}></${Box}><${Button} size="small" onClick=${()=>setChangelogOpen(true)}>View</${Button}><${IconButton} size="small" onClick=${()=>update(next=>next.changelogSeen=APP_VERSION)}><${Icon} name="close"/></${IconButton}></${Paper}>`:null}
      ${feedback?html`<div className="save-pop"><${Typography} fontWeight=${850}>✓ ${feedback}</${Typography}></div>`:null}
      ${completion?html`<${CompletionOverlay} summary=${completion} reducedMotion=${data.settings.reducedMotion} onClose=${()=>setCompletion(null)}/>`:null}
      <${TrainingGuideDialog} open=${guide.open} initialTerm=${guide.term} onClose=${()=>setGuide({open:false,term:''})}/><${ChangelogDialog} open=${changelogOpen} onClose=${closeChangelog}/><${OnboardingDialog} open=${onboardingOpen} data=${data} update=${update} onClose=${()=>setOnboardingOpen(false)}/>
    </${Box}></${ThemeProvider}>`;
  }

  ReactDOM.createRoot(rootNode).render(html`<${App}/>`);
})();
