import ScreenTitle from '../shared/ui/ScreenTitle';
import Wrapper from '../shared/ui/Wrapper';
import {Page} from '../shared/ui/Page';
import Main from '../shared/ui/Main';
import Footer from '../shared/ui/Footer';
import Button from '../shared/ui/Button';
import {useIntegration} from '../app/ui/IntegrationContext';
import {EditableTableBox, EditableTableBoxes, EditableTableRow} from '../shared/ui/EditableTable';
import {DateCalendar, LocalizationProvider} from '@mui/x-date-pickers';
import {useState} from 'react';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

export default function ContractEndDate() {
  const [value, setValue] = useState();
  const {onComplete, setContractEndDate} = useIntegration();
  return (
    <Page>
      <ScreenTitle title={'Contract end date.'} subTitle={"When your contract is about to expire?"} />
      <Wrapper>
        <Main>
          <div style={{ paddingTop: 18 }}>
            <EditableTableRow>
              <EditableTableBoxes>
                <EditableTableBox
                  isFirst={true}
                  disablePadding={true}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar onChange={(newValue) => setValue(newValue)} />
                  </LocalizationProvider>
                </EditableTableBox>
              </EditableTableBoxes>
            </EditableTableRow>
          </div>
        </Main>
        <Footer>
          <Button
            title={"Next"}
            disabled={!value}
            onClick={() => {
              if (value) {
                setContractEndDate(value.toString())
              }
              onComplete()
            }}
            variant="executive"/>
          <Button
            onClick={() => onComplete()}
            title={"I don't know"}
            variant="guiding"/>
        </Footer>
      </Wrapper>
    </Page>
  );
}
