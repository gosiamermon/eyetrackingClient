import { Header } from '../app/features/header/model';
import { Table } from '../app/features/table/model';
import { Details } from '../app/features/details/model';
import { Translator } from '../app/features/translator/model';

export interface Store {
  details: Details;
  header: Header;
  table: Table;
  translator: Translator;
};
