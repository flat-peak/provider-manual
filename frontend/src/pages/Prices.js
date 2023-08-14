import {useDispatch, useSelector} from 'react-redux';
import {
  addPriceRange,
  findWeekdaySchedule, getEndDayOfRange, getEndMonthOfRange, getStartDayOfRange, getStartMonthOfRange,
  removePriceRange,
  selectPlan,
  selectStructure, setPrice, setSamePrices,
} from '../app/lib/store/reducers/tariffReducer';
import {useEffect, useState} from 'react';
import {
  resolveMonthLabelByKey,
  TARIFF_DAYS,
  TARIFF_SIDE,
  TARIFF_WEEKDAYS,
  TARIFF_WEEKEND,
} from '../app/lib/config/config';
import {isEqualObjects} from '@flat-peak/javascript-sdk';
import {Page} from '../shared/ui/Page';
import ScreenTitle from '../shared/ui/ScreenTitle';
import Wrapper from '../shared/ui/Wrapper';
import Main from '../shared/ui/Main';
import FlatList from 'flatlist-react';
import Button from '../shared/ui/Button';
import {
  EditableTableBox,
  EditableTableBoxes, EditableTableControl, EditableTableInput,
  EditableTableLabel,
  EditableTableRow,
} from '../shared/ui/EditableTable';
import {TouchableOpacity} from '../shared/ui/TouchableOpacity';
import Footer from '../shared/ui/Footer';
import {Delete} from '@styled-icons/material';
import useDynamicRefs from "use-dynamic-refs";
import {addLeadingZero} from '../shared/lib/util';
import PeriodCaption from '../shared/ui/PeriodCaption';
import Checkbox from '../shared/ui/Checkbox';
import {useLocation, useNavigate} from 'react-router-dom';
import {useIntegration} from '../app/ui/IntegrationContext';

export default function Prices() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {onComplete, setAuthMetaData, setClientSchedule} = useIntegration();
  const { side, seasonIndex, daysIndex } = state || {
    side: 'import',
    seasonIndex: 0,
    daysIndex: 0,
  }
  const plan = useSelector(selectPlan);
  const structure = useSelector(selectStructure);
  const dispatch = useDispatch();
  const [sameSchedule, setSameSchedule] = useState(false);
  const [getRef, setRef] = useDynamicRefs();

  const schedule = findWeekdaySchedule(plan[side]);
  const daysPresets = schedule.data[seasonIndex].days_and_hours;
  const currentPriceRange = daysPresets[daysIndex];

  const daysHash = currentPriceRange.days.join(",");
  const isWeekendMode = [
    TARIFF_WEEKEND,
    TARIFF_DAYS.slice(5, 7).join(","),
  ].includes(daysHash);

  const isWeekdaysMode = [
    TARIFF_WEEKDAYS,
    TARIFF_DAYS.slice(0, 5).join(","),
  ].includes(daysHash);

  const weekdaysPriceRange = isWeekdaysMode
    ? currentPriceRange
    : daysPresets.find((preset) => {
        return [TARIFF_WEEKDAYS, TARIFF_DAYS.slice(0, 5).join(",")].includes(
          preset.days.join(",")
        );
      });

  const flat = !structure.hours;

  useEffect(() => {
    if (!isWeekendMode || !weekdaysPriceRange) {
      return;
    }

    setSameSchedule(
      isEqualObjects(currentPriceRange.hours, weekdaysPriceRange.hours)
    );
  }, [weekdaysPriceRange, currentPriceRange, isWeekendMode]);

  const displayPeriods = structure.hours && (!isWeekendMode || !sameSchedule);
  const displayCaptions = structure.months || structure.days;
  const displaySinglePrice =
    !structure.hours && (!isWeekendMode || !sameSchedule);

  const toggleSameSchedule = (checked) => {
    setSameSchedule(checked);
    if (checked) {
      dispatch(
        setSamePrices({
          side,
          seasonIndex,
          daysIndex,
          weekdaysIndex: daysPresets.indexOf(weekdaysPriceRange),
        })
      );
    }
  };

  const removePeriod = (priceIndex) => {
    dispatch(removePriceRange({ side, seasonIndex, daysIndex, priceIndex }));
  };

  const addPeriod = () => {
    dispatch(addPriceRange({ side, seasonIndex, daysIndex }));
  };

  const getCaption = () => {
    return side === TARIFF_SIDE.IMPORT
      ? flat
        ? "Cost of electricity"
        : "Time of day prices"
      : "Prices you paid";
  };

  const getDescription = () => {
    if (!structure.months) {
      return `What is the cost per kWh on your ${
        side === TARIFF_SIDE.IMPORT ? "import" : "export"
      } tariff?`;
    }
    return `What is the cost per kWh for your ${
      side === TARIFF_SIDE.IMPORT ? "import" : "export"
    } tariff?. Add more periods as required.`;
  };

  const getNextScreenParams = () => {
    if (daysIndex < daysPresets.length - 1) {
      return {
        complete: false,
        path: "/prices",
        state: {
          side,
          seasonIndex: seasonIndex,
          daysIndex: daysIndex + 1,
        },
      };
    } else if (seasonIndex < schedule.data.length - 1) {
      return {
        complete: false,
        path: "/prices",
        state: {
          side,
          seasonIndex: seasonIndex + 1,
          daysIndex: 0,
        },
      };
    } else if (side === TARIFF_SIDE.IMPORT && plan[TARIFF_SIDE.EXPORT]) {
      return {
        complete: false,
        path: "/",
        state: {
          side: TARIFF_SIDE.EXPORT,
        },
      };
    } else {
      return {
        complete: true,
      };
    }
  };
  const validatePrice = (priceIndex) => {
    const targetPriceEl = currentPriceRange.hours[priceIndex];
    if (!targetPriceEl) {
      return;
    }
    const value = targetPriceEl.cost;
    let normalizedPrice = (
      Math.floor((parseFloat(String(value)) || 0) * 100) / 100
    ).toFixed(2);
    dispatch(
      setPrice({
        price: {
          ...targetPriceEl,
          cost: Number(normalizedPrice),
        },
        side,
        seasonIndex,
        daysIndex,
        priceIndex,
      })
    );
  };
  const updatePrice = (value, priceIndex) => {
    const targetPriceEl = currentPriceRange.hours[priceIndex];
    if (!targetPriceEl) {
      return;
    }
    dispatch(
      setPrice({
        price: {
          ...targetPriceEl,
          cost: value,
        },
        side,
        seasonIndex,
        daysIndex,
        priceIndex,
      })
    );
  };

  const updateTime = (value, priceIndex, priceMode) => {
    const [hours, minutes] = value.split(':');
    const targetPriceEl = currentPriceRange.hours[priceIndex];
    if (targetPriceEl) {
      dispatch(
        setPrice({
          price: {
            ...targetPriceEl,
            ["valid_" + priceMode]:
            [addLeadingZero(Number(hours)), addLeadingZero(Number(minutes))].join(":") +
            ":00",
          },
          side,
          seasonIndex,
          daysIndex,
          priceIndex,
        })
      );
    }
  }

  const months = schedule.data[seasonIndex].months;
  const valid = currentPriceRange.hours.every((h) => Number(h.cost) > 0);

  return (
    <Page>
        <ScreenTitle title={getCaption()} subTitle={getDescription()} />
        <Wrapper>
          {displayCaptions && (
            <PeriodCaption
              monthFrom={resolveMonthLabelByKey(getStartMonthOfRange(months))}
              monthTo={resolveMonthLabelByKey(getEndMonthOfRange(months))}
              dayFrom={getStartDayOfRange(currentPriceRange.days)}
              dayTo={getEndDayOfRange(currentPriceRange.days)}
            />
          )}
          {isWeekendMode && weekdaysPriceRange && (
            <Checkbox
              value={sameSchedule}
              defaultChecked={false}
              title={"My tariff is same on weekdays and weekend"}
              onChange={(checked) => toggleSameSchedule(checked)}
            />
          )}

          <Main>
            {displayPeriods && (
              <div style={{ paddingTop: 18 }}>
                <Main>
                <FlatList
                  list={currentPriceRange.hours}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={( item, index ) => {
                    return (
                      <EditableTableRow
                        key={index.toString()}
                        isLast={index === currentPriceRange.hours.length - 1}
                      >
                        <EditableTableBoxes>
                          <EditableTableBox
                            isFirst={true}
                            onClick={() => getRef(`valid_from_${index}`)?.current?.focus()}
                          >
                            <EditableTableLabel>From:</EditableTableLabel>
                            <EditableTableInput
                              type={"time"}
                              autoComplete={"off"}
                              autoCorrect={"off"}
                              blurOnSubmit={true}
                              ref={setRef(`valid_from_${index}`)}
                              onInput={(event) =>
                                 updateTime(event.target.value, index, 'from')
                              }
                              value={item.valid_from.substring(0, 5)}
                            />
                          </EditableTableBox>
                          <EditableTableBox
                            onClick={() => getRef(`valid_to_${index}`)?.current?.focus()}
                          >
                            <EditableTableLabel>To:</EditableTableLabel>
                            <EditableTableInput
                              type={"time"}
                              autoComplete={"off"}
                              autoCorrect={"off"}
                              blurOnSubmit={true}
                              ref={setRef(`valid_to_${index}`)}
                              onInput={(event) =>
                                updateTime(event.target.value, index, 'to')
                              }
                              value={item.valid_to.substring(0, 5)}
                            />
                          </EditableTableBox>
                          <EditableTableBox
                            onClick={() =>
                              getRef(`cost_${index}`)?.current?.focus()
                            }
                          >
                            <EditableTableLabel>Price:</EditableTableLabel>
                            <EditableTableInput
                              isLong={String(item.cost).length > 5}
                              inputMode={"decimal"}
                              autoComplete={"off"}
                              autoCorrect={"off"}
                              blurOnSubmit={true}
                              enterKeyHint={"done"}
                              clearTextOnFocus={!String(item.cost)}
                              ref={setRef(`cost_${index}`)}
                              onInput={(event) =>
                                updatePrice(event.target.value, index)
                              }
                              onBlur={() => validatePrice(index)}
                              value={item.cost ? String(item.cost) : '0.00'}
                            />
                          </EditableTableBox>
                        </EditableTableBoxes>

                        <EditableTableControl>
                          {currentPriceRange.hours.length > 1 && (
                            <TouchableOpacity
                              onClick={() => removePeriod(index)}
                            >
                              <Delete width={24} height={24} color="#FF8484" />
                            </TouchableOpacity>
                          )}
                        </EditableTableControl>
                      </EditableTableRow>
                    );
                  }}
                />
                  <Button
                    size={"small"}
                    style={{ margin: 0 }}
                    title={"+ Add time period"}
                    onClick={() => addPeriod()}
                  />
                </Main>
              </div>
            )}
            {!displaySinglePrice ? null : (
              <div style={{ paddingTop: 18 }}>
                <EditableTableRow>
                  <EditableTableBoxes>
                    <EditableTableBox
                      isFirst={true}
                      onClick={() => getRef("cost_0")?.current?.focus()}
                    >
                      <EditableTableLabel>Price:</EditableTableLabel>
                      <EditableTableInput
                        inputMode={"decimal"}
                        autoComplete={"off"}
                        autoCorrect={"off"}
                        blurOnSubmit={true}
                        enterKeyHint={"done"}
                        ref={setRef("cost_0")}
                        onInput={(e) => updatePrice(e.target.value, 0)}
                        onBlur={() => validatePrice(0)}
                        value={String(currentPriceRange.hours[0].cost)}
                      />
                    </EditableTableBox>
                  </EditableTableBoxes>
                </EditableTableRow>
              </div>
            )}
          </Main>
          <Footer>
            <Button
              title={"Next"}
              variant="executive"
              disabled={!valid}
              onClick={() => {
                const { complete, path, state } = getNextScreenParams();
                if (!complete) {
                  navigate(path, {state});
                } else {
                  setAuthMetaData({ foo: '2'});
                  setClientSchedule(schedule)
                  onComplete();
                }
              }}
            />
          </Footer>
        </Wrapper>
    </Page>
  );
}
