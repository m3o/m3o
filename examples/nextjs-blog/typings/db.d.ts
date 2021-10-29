type m3oDbQuery = {
  id?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
  query?: string;
  table?: string;
};

type m3oDbMethods = 'Create' | 'Delete' | 'Read' | 'Truncate' | 'Update';

type m3oDbCreateRecordPayload<R> = {
  record: R;
  table: string;
};
