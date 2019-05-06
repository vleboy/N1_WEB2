export const menuOpen = function(name) {
  let openName = []
  if (name.includes('na') && name != 'dayMergent') {
    openName = ['report', 'nareport']
  } else if (name == 'kychess') {
    openName = ['report', 'kyreport']
  } else if (name == 'ttgvideo') {
    openName = ['report', 'ttgreport']
  } else if (name.includes('sa')) {
    openName = ['report', 'sareport']
  } else if (name == 'sbvideo' || name == 'sbtrue' || name == 'sbAll') {
    openName = ['report', 'sbreport']
  } else if (name == 'mgvideo') {
    openName = ['report', 'mgreport']
  } else if (name == 'pgGame') {
    openName = ['report', 'pgReport']
  } else if (name == 'habaGame') {
    openName = ['report', 'habaReport']
  } else if (name == 'pngGame') {
    openName = ['report', 'pngReport']
  } else if (name == 'agtrue') {
    openName = ['report', 'agreport']
  } else if (name == 'ysbSport') {
    openName = ['report', 'ysbReport']
  } else if (name == 'rtgGame') {
    openName = ['report', 'rtgReport']
  } else if (name == 'dtGame') {
    openName = ['report', 'dtReport']
  } else if (name == 'ppGame') {
    openName = ['report', 'ppReport']
  } else if (name == 'ugsport') {
    openName = ['report', 'ugreport']
  } else if (name == 'allreport') {
    openName = ['report']
  } else if (name == 'businessList' || name == 'lineBusiness' || name == 'warnList') {
    openName = ['businessCenter']
  } else if (name == 'ownspace-index') {
    openName = []
  } else if (name == 'adminList' || name == 'lineNumList' || name == 'adminRole') {
    openName = ['adminCenter']
  } else if (name.includes('Log')) {
    openName = ['logCenter']
  } else if (name == 'playList') {
    openName = ['playerCenter']
  } else if (
           name == 'boothList' ||
           name == 'gameMailList' ||
           name == 'horseRaceLampList' ||
           name == 'gameNoticeList' ||
           name == 'prizeList'
         ) {
          openName = ['operationCentert']
         } else if (name == 'board') {
           openName = ['board']
         } else if (name == 'newBoard') {
           openName = ['newBoard']
         } else if (name == 'flow' || name == 'noTransferReport') {
           openName = ['noTransfer']
         } else if (name == 'dayMerchant') {
           openName = ['dayReport']
         }
  return openName
}
