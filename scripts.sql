

-- select the non-avaible intervals of the gived date
select to_char(schedules.schedule_date, 'HH24:MI') AS "start" ,
      to_char(schedules.schedule_date + CAST(haircuts.duration as Interval ), 'HH24:MI') AS "end", 'non-avaible' as "type"
      from schedules 
      left join haircuts on haircuts.id = schedules.haircut_id
      where CAST(schedules.schedule_date AS Date) = '2022-11-20'


--  select non-work intervals of the gived date
select nw.start, nw.end ,'non-work' as "type"
from non_work_hour_intervals nw  
left join work_schedule_days ws on nw.work_schedule_day_id = ws.id
where extract(isodow from date '2022-11-20') = ws.id



select  extract(isodow from date '2022-11-20')
select * from non_work_hour_intervals;

select * from work_schedule_days;
select * from schedules;




select extract(isodow from date '2022-08-07');


