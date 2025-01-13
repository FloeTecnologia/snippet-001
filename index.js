var v=(r,t)=>()=>(t||r((t={exports:{}}).exports,t),t.exports);var j=v((Te,Y)=>{Y.exports={SLOT_TIME:30,GOOGLESHEET_TABS_NAME:{SERVICES:"Servi\xE7os!A:F",PROFESSSIONALS:"Profissionais!A:E",SCHEDULES:"Agendamentos!A:J"},GOOGLESHEET_FIELDS_NAME:{ID:"Identifica\xE7\xE3o",STATUS:"Situa\xE7\xE3o",NAME:"Nome",VISIBLE:"Vis\xEDvel",CALENDAR_ID:"Calend\xE1rio ID",SERVICES:"Servi\xE7os ID",DURATION:"Dura\xE7\xE3o (min)",BEFORE_DURATION:"Anteced\xEAncia (min)"},GOOGLESHEET_SCHEDULE_ORDER_FIELDS:["CLIENT_ID","SERVICE_ID","PROFESSIONAL_ID","SERVICE_NAME","PROFESSIONAL_NAME","SERVICE_DATETIME_START","SERVICE_DATETIME_END","CLIENT_NAME","CLIENT_PHONE","CREATED_AT"],CALENDAR_TITLE:"[CLIENT_NAME] | [SERVICE_NAME]",CALENDAR_DESCRIPTION:"Servi\xE7o: [SERVICE_NAME]\nCliente Nome: [CLIENT_NAME]\nCliente Telefone: [CLIENT_PHONE]"}});var y=v((me,J)=>{async function ce(r){try{let{services:t,professionals:n}=await z(r);return{services:t,professionals:n}}catch(t){return events.emit("error",t),{error:!0}}}async function z({config:r,services:t,arguments:n}){let{GOOGLESHEET_ID:o,GOOGLESHEET_TABS_NAME:a,GOOGLESHEET_FIELDS_NAME:e}=r,{professional_id:u,service_id:i}=n,c=[],E,S,_=await t.googleapis.getGoogleSheetData({spreadsheetId:o,range:a.SERVICES}),d=await t.googleapis.getGoogleSheetData({spreadsheetId:o,range:a.PROFESSSIONALS});return d=d.map(s=>(s[e.SERVICES]=s[e.SERVICES].split(","),s)),i&&(E=_.find(s=>s[e.ID]===i&&s[e.STATUS]===e.VISIBLE),E||c.push("Service ID unavailable")),u&&(S=d.find(s=>s[e.ID]===u&&s[e.STATUS]===e.VISIBLE),S||c.push("Professional ID unavailable")),E&&S&&!S[e.SERVICES].includes(E[e.ID])&&c.push("Service unavailable for this professional"),{errors:c,services:_,professionals:d,serviceSelected:E,professionalSelected:S}}J.exports={default:ce,handleResources:z}});var X=v((Ae,W)=>{var f=require("moment"),{handleResources:Se}=y();async function ue(r){let{config:t,services:n,arguments:o,events:a}=r;try{let{UTC_OFFSET:e,DATE_FORMAT:u,DATE_ISO_FORMAT:i,SLOT_TIME:c,GOOGLESHEET_FIELDS_NAME:E}=t,{date_start:S,date_end:_}=o,{errors:d,serviceSelected:s,professionalSelected:D}=await Se(r);if(d.length)return{errors:d};let P=D[E.ID],M=D[E.CALENDAR_ID],B=Number(s[E.DURATION]),F=Number(s[E.BEFORE_DURATION]),G=f(S,u).startOf("day").utcOffset(e,!0),C=f(_,u).endOf("day").utcOffset(e,!0),N=f().utcOffset(e),L=N.clone().add(F,"minutes"),l={},T=G.clone();for(;T.isBefore(C);)l[T.format(i)]=[],T.add(1,"day");let V=await n.googleapis.getGoogleCalendarsBusy({calendarIds:[M],timeMin:G.toISOString(),timeMax:C.clone().add(1,"day").toISOString()}),{errors:O,busy:g}=V[M];return d&&d.length?{errors:O}:(Object.keys(l).forEach(I=>{let m=f(I).startOf("day").utcOffset(e,!0),R=f(I).endOf("day").utcOffset(e,!0),h=K({config:t,busy:g,dateStart:m.toISOString(),dateEnd:R.toISOString()}).filter(({start:p})=>f(p).format(i)===I);l[I]=Q({config:t,free:h,serviceDuration:B,slotDuration:c}),N.isSame(m,"date")&&(F&&N.isSame(L,"date")?l[I]=l[I].filter(p=>p>=L.format("HH:mm")):l[I]=[])}),{professionalId:P,slots:l})}catch(e){return a.emit("error",e),{error:!0}}}function K({config:r,dateStart:t,dateEnd:n,busy:o}){let{UTC_OFFSET:a}=r;t=f(t).utcOffset(a),n=f(n).utcOffset(a);let e=[],u=o.length,i=f(o[0].start).utcOffset(a);t.isBefore(i)&&e.push({start:t.toISOString(),end:i.toISOString()}),o.forEach((E,S)=>{let _=o[S+1]?.start;if(!_)return;let d=f(_).utcOffset(a),s=f(E.end).utcOffset(a);s.format("HH:mm")==="23:59"&&s.add(1,"minute"),s.isBefore(d)&&e.push({start:s.toISOString(),end:d.toISOString()})});let c=f(o[u-1].end).utcOffset(a);return c.isBefore(n)&&e.push({start:c.toISOString(),end:n.toISOString()}),e}function Q({config:r,free:t,serviceDuration:n,slotDuration:o}){let{UTC_OFFSET:a}=r,e=[];return t.forEach(u=>{let i=f(u.start),c=f(u.end);for(;i.clone().add(n,"minutes").isSameOrBefore(c);)e.push(i.utcOffset(a).format("HH:mm")),i.add(o,"minutes")}),e}function de({time:r,round:t}){let n=r.minute(),o=Math.ceil(n/t)*t;return o>=60?r.startOf("hour").add(1,"hour"):r.minute(o).second(0)}W.exports={default:ue,getCalendarFreePeriods:K,getCalendarFreeTimeSlots:Q,roundTime:de}});var te=v((Ne,ee)=>{async function fe({config:r,request:t}){try{let{MANYCHAT_FIELDS_NAME:n}=r,{body:o}=t,a=o.custom_fields,e=a[n.CLIENT_NAME],u=a[n.CLIENT_PHONE]||o.whatsapp_phone,i=e&&u;return{id:o.id,confirmed:i,name:e,phone:u}}catch(n){return events.emit("error",n),{error:!0}}}ee.exports={default:fe}});var ne=v((De,re)=>{var q=require("moment"),{handleResources:le}=y();async function Ie(r){let{config:t,services:n,request:o,arguments:a,events:e}=r;try{let b=function($){return $.replace(/\[CLIENT_NAME\]/g,T).replace(/\[CLIENT_PHONE\]/g,m).replace(/\[SERVICE_NAME\]/g,h)};var u=b;let{UTC_OFFSET:i,UTC_TIMEZONE:c,DATE_FORMAT:E,TIME_FORMAT:S,GOOGLESHEET_ID:_,GOOGLESHEET_TABS_NAME:d,GOOGLESHEET_FIELDS_NAME:s,MANYCHAT_FIELDS_ID:D,CALENDAR_TITLE:P,CALENDAR_DESCRIPTION:M,GOOGLESHEET_SCHEDULE_ORDER_FIELDS:B}=t,{body:F}=o,G=F.id,{client_id:C,professional_id:N,service_id:L,service_datetime:l,client_name:T,client_phone:V}=a,{errors:O,serviceSelected:g,professionalSelected:I}=await le(r);if(O.length)return{errors:O};let m=V.replace("+",""),R=I[s.CALENDAR_ID],U=I[s.NAME],h=g[s.NAME],p=Number(g[s.DURATION]),w=Number(g[s.BEFORE_DURATION]),A=q(l,`${E} ${S}`).utcOffset(i,!0),se=q().utcOffset(i);A.diff(se,"minutes")<0&&O.push("Scheduling in the past is not allowed");let H=A.clone().add(p,"minutes"),oe=A.clone().subtract(w,"minutes");if(A.diff(oe,"minutes")<Number(w)&&O.push(`Minimum time is ${w} minutes in advance.`),(await n.googleapis.getGoogleCalendarsBusy({calendarIds:[R],timeMin:A.toISOString(),timeMax:H.toISOString()}))[R].busy.length&&O.push(`Professional unavailable at ${l} to `+H.format(`${E} ${S}`)),O.length)return{errors:O};let ie=b(P),ae=b(M);await n.googleapis.addGoogleCalendarEvent({calendarId:R,event:{summary:ie,description:ae,start:{dateTime:A.format(),timeZone:c},end:{dateTime:H.format(),timeZone:c}}});let x=q().utcOffset(i).format(`${E} ${S}`),Z=A.format(`${E} ${S}`),k=H.format(`${E} ${S}`),Ee={CLIENT_ID:C,SERVICE_ID:L,PROFESSIONAL_ID:N,SERVICE_NAME:h,PROFESSIONAL_NAME:U,SERVICE_DATETIME_START:Z,SERVICE_DATETIME_END:k,CLIENT_NAME:T,CLIENT_PHONE:m,CREATED_AT:x};return await n.googleapis.appendGoogleSheetData({spreadsheetId:_,range:d.SCHEDULES,values:[B.map($=>Ee[$]||"")]}),n.manychat.manychatSetCustomFields({subscriber_id:G,fields:[{field_id:D.CLIENT_NAME,field_name:"string",field_value:T},{field_id:D.CLIENT_PHONE,field_name:"string",field_value:m}]}),{success:!0,client_id:C,service_id:L,professional_id:N,service_name:h,professional_name:U,service_datetime_start:Z,service_datetime_end:k,client_name:T,client_phone:m,created_at:x}}catch(i){return e.emit("error",i),{error:!0}}}re.exports={default:Ie}});module.exports={config:j(),functions:function(r){return{[r.GET_CATALOG]:y().default,[r.GET_CALENDAR]:X().default,[r.GET_CUSTOMER]:te().default,[r.SEND_SCHEDULE]:ne().default}}};
