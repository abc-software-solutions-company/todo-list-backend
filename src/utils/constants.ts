export const jwtConstants = {
  secret: process.env.SECRET_KEY || 'ThisIsSecret',
};

export const priorities = { lowest: 'Lowest', low: 'Low', medium: 'Medium', high: 'High', highest: 'Highest' };

export const AttachmentType = {
  image: 'image',
  file: 'file',
};
export enum TaskTypeEnum {
  TASK = 'Task',
  STORY = 'Story',
  BUG = 'Bug',
  SUB_TASK = 'Sub-task',
}
