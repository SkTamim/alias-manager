// src/data/commandDictionary.js

// This dictionary helps our app intelligently parse and describe common Rhino commands.
export const commandDictionary = {
    'zoom': { command: '! _Zoom', description: 'Zoom view.' },
    'ze': { command: "! '_Zoom _Extents", description: 'Zoom to all extents.' },
    'zs': { command: "! '_Zoom _Selected", description: 'Zoom to selected objects.' },
    'split': { command: '! _Split', description: 'Split an object.' },
    'offsetsrf': { command: '! _OffsetSrf', description: 'Offset a surface.' },
    'planar': { command: "! '_PlanarSrf", description: 'Create a planar surface from curves.' },
    'move': { command: '! _Move', description: 'Move objects.' },
    'ungroup': { command: '! _Ungroup', description: 'Ungroup selected objects.' },
    'pointson': { command: '! _PointsOn', description: 'Turn on control points.' },
    'pointsoff': { command: '! _PointsOff', description: 'Turn off control points.' },
    'join': { command: '! _Join', description: 'Join objects together.' },
    'lock': { command: '! _Lock', description: 'Lock objects.' },
    'hide': { command: '! _Hide', description: 'Hide objects.' },
    'group': { command: '! _Group', description: 'Group objects.' },
    'trim': { command: '! _Trim', description: 'Trim objects.' },
    'loft': { command: '! _Loft', description: 'Create a surface by lofting curves.' },
    'revolve': { command: '! _Revolve', description: 'Revolve a curve to create a surface.' },
    'cap': { command: '! _Cap', description: 'Cap open polysurfaces.' },
    'booleanunion': { command: '! _BooleanUnion', description: 'Join solids with a boolean union.' },
    'booleandifference': { command: '! _BooleanDifference', description: 'Subtract solids with a boolean difference.' },
    'filletedge': { command: '! _FilletEdge', description: 'Create a rounded fillet on edges.' },
};