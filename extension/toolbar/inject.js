import Channel from '../utils/channel.js'

var pallete           = document.createElement('tool-pallete')
var src_path          = chrome.extension.getURL(`tuts/guides.gif`)
const channel_name    = 'design-artboard'
const appendPallete   = () => document.body.prepend(pallete)

pallete.tutsBaseURL   = src_path.slice(0, src_path.lastIndexOf('/'))

const Pipe = new Channel({
  name: channel_name,
  model: {
    src_channel:    channel_name,
    target_channel: 'design-panel',
  }
})

const layersFromDOM = ({nodeName, className, id, children}) => ({
  nodeName, className, id, 
  children: [...children].map(layersFromDOM),
})

// append and watch toolbar selections
appendPallete()
pallete.selectorEngine.onSelectedUpdate(nodes =>
  Pipe.post({
    action: 'selected',
    payload: nodes.map(layersFromDOM),
  }))

// watch pipe messages (they'll be auto filtered for this pipe)
Pipe.port.onMessage.addListener(message => {
  console.log(`${channel_name} recieved port message`, message)
})

Pipe.message.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`${channel_name} onMessage`, request)

  const { action, params } = request

  // only respond to toolSelection atm
  if (action != 'toolSelected') return

  const [pallete] = document.getElementsByTagName('tool-pallete')
  pallete && pallete[action](params)
  // todo: send for tool to select element as well
})
