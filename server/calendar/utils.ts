import moment, { Moment } from "moment";
import { TimeSlotBounds } from "./types";
import { groupBy } from "lodash";

const db = require("db");

export const getSavedEvents = async (userID: string): Promise<TimeSlotBounds[]> => {
    const events : TimeSlotBounds[] = await db.calendar.findEventsForUser(userID);
    return events.sort((a: Record<string, Moment>, b: Record<string, Moment>) => {
      return moment(a.start).diff(moment(b.start))
    })
  }
  
export const fillTimeSlots = (startTime: Moment, stopTime: Moment): string[] => {
    const timeSlotArray: string[] = []
    const timeGapInHours: number = stopTime.diff(startTime, 'hours')

    if (!(timeGapInHours >= 1)){
        return timeSlotArray
    }

    for (let hour = 0; hour < timeGapInHours; hour++) {
        const nextSlot = timeSlotArray.length == 0 ? startTime : moment(timeSlotArray.at(-1)).add(1, "hours")
        timeSlotArray.push(
            nextSlot.format('YYYY-MM-DDTHH:mm:ss.SSS')
        )
    }
    return timeSlotArray
}

export const getAvailableTimeSlots = async (hostUserId: string): Promise<string[]> => {
    let availableSlots: string[] = []

    const events: TimeSlotBounds[] = await getSavedEvents(hostUserId)
    const groupedEvents: Record<number, TimeSlotBounds[]> = groupBy(events, (record: TimeSlotBounds) => moment(record.start).date())

    for (let index = 0; index < 7; index++) {
        
        // start from tomorrow and increment upto 7 days
        const targetDay : Moment = moment().add(index + 1, 'days')
        const targetDate : number = targetDay.date()
        const dayEvents : TimeSlotBounds[] = groupedEvents[targetDate];  // get day's scheduled events

        const DefaultStartTime : Moment = targetDay.clone().hour(9).startOf("hour")
        const DefaultStopTime : Moment = targetDay.clone().hour(17).startOf("hour")

        if (dayEvents === undefined){
            // No events defined for this day. Auto fill it with one hour timeslots between start of day (9am) to end of day (17hrs)
            availableSlots.push(...fillTimeSlots(DefaultStartTime, DefaultStopTime))
        }else{
            // check if gaps in between slots can accomodate another slot.
            for (let index = 0; index < dayEvents.length + 1; index++) {
                const startTime : Moment= index == 0 ? DefaultStartTime : moment(dayEvents[index - 1].end)
                const stopTime : Moment = index == dayEvents.length ? DefaultStopTime : moment(dayEvents[index].start)
                availableSlots.push(...fillTimeSlots(startTime, stopTime))
            }
        }
    }
    return availableSlots

}